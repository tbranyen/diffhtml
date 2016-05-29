import { parse } from 'diffhtml/lib/util/parser';
import uuid from 'diffhtml/lib/util/uuid';
import * as babylon from 'babylon';

const symbol = '__DIFFHTML_BABEL__';
const isPropEx = /(=|'|")/;

export default function({ types: t }) {
  const makeConcatExpr = (value, supplemental) => {
    return value.split(symbol).reduce((memo, str, i, parts) => {
      // Last part should be string terminator
      if (i === parts.length - 1 && memo) {
        memo = t.binaryExpression('+', memo, t.stringLiteral(str));
        return memo;
      }

      let dynamicBit = supplemental.shift();

      // First run.
      if (!memo) {
        memo = t.binaryExpression('+', t.stringLiteral(str), dynamicBit);
      }
      else {
        memo = t.binaryExpression('+', memo, t.binaryExpression(
          '+', t.stringLiteral(str), dynamicBit
        ));
      }

      return memo;
    }, null);
  };

  const identifierToMemberExpression = (identifier) => {
    const identifiers = identifier.split('.');

    if (identifiers.length === 0) {
      return;
    }
    else if (identifiers.length === 1) {
      return identifiers[0];
    }
    else {
      return identifiers.reduce((memo, identifier) => {
        if (!memo) {
          memo = t.identifier(identifier);
        }
        else {
          memo = t.memberExpression(memo, t.identifier(identifier));
        }

        return memo;
      }, null);
    }
  };

  const memberExpressionToString = (memberExpression) => {
    var retVal = '';

    retVal += memberExpression.object.name + '.';

    if (memberExpression.property.type === 'Identifier') {
      retVal += memberExpression.property.name;
    }
    else if (memberExpression.property.type === 'MemberExpression') {
      retVal += memberExpressionToString(memberExpression.property.type);
    }

    return retVal;
  };

  const visitor = {
    TaggedTemplateExpression(path, plugin) {
      let tagName = '';

      if (path.node.tag.type === 'Identifier') {
        tagName = path.node.tag.name
      }
      else if (path.node.tag.type === 'MemberExpression') {
        tagName = memberExpressionToString(path.node.tag);
      }

      if (tagName !== (plugin.opts.tagName || 'html')) { return; }

      const supplemental = {
        props: [],
        children: []
      };

      const quasis = path.node.quasi.quasis;
      const expressions = path.node.quasi.expressions;
      const quasisLength = quasis.length;
      const expressionsLength = expressions.length;

      if (quasisLength === 0 && expressionsLength === 0) {
        return;
      }
      else if (!quasisLength && expressionsLength) {
        path.replaceWithMultiple(expressions);
        path.traverse(visitor);
        return;
      }

      const HTML = [];
      const dynamicBits = [];

      quasis.forEach(quasi => {
        HTML.push(quasi.value.raw);

        if (expressions.length) {
          let expression = expressions.shift();

          if (expression.type === 'StringLiteral') {
            HTML.push(expression.value);
          }
          else {
            let string = HTML[HTML.length - 1] || '';
            let lastSegment = string.split(' ').pop();
            let lastCharacter = lastSegment.trim().slice(-1);
            let isProp = Boolean(lastCharacter.match(isPropEx));

            let wholeHTML = HTML.join('');
            let lastStart = wholeHTML.lastIndexOf('<');
            let lastEnd = wholeHTML.lastIndexOf('>');

            if (lastEnd === -1 && lastStart !== -1) {
              isProp = true;
            }
            else if (lastEnd > lastStart) {
              isProp = false;
            }
            else if (lastEnd < lastStart) {
              isProp = true;
            }

            HTML.push(symbol);

            if (isProp) {
              supplemental.props.push(expression);
            }
            else {
              supplemental.children.push(expression);
            }
          }
        }
      });

      const state = { needsUUID: false };
      const root = parse(HTML.join('')).childNodes;
      const strRoot = JSON.stringify(root.length === 1 ? root[0] : root);
      const vTree = babylon.parse('(' + strRoot + ')');

      const createElement = plugin.opts.createElement ?
        identifierToMemberExpression(plugin.opts.createElement) :
        identifierToMemberExpression('diff.createElement');

      const createAttribute = plugin.opts.createAttribute ?
        identifierToMemberExpression(plugin.opts.createAttribute) :
        identifierToMemberExpression('diff.createAttribute');

      /**
       * Replace the dynamic parts of the AST with the actual quasi
       * expressions.
       *
       * @param statements
       */
      function replaceDynamicBits(statements) {
        statements.forEach((statement, i) => {
          const childNode = statement.expression;

          if (childNode.type === 'ArrayExpression') {
            let newAst = childNode.elements.map(e => t.expressionStatement(e));

            replaceDynamicBits(newAst);
            childNode.elements = newAst.map(e => e.expression);

            return;
          }

          const nodeName = childNode.properties.filter(property => {
            return property.key.value === 'nodeName';
          })[0].value;

          const nodeType = childNode.properties.filter(property => {
            return property.key.value === 'nodeType';
          })[0].value.value;

          const nodeValue = childNode.properties.filter(property => {
            return property.key.value === 'nodeValue';
          })[0].value;

          const attributes = childNode.properties.filter(property => {
            return property.key.value === 'attributes';
          })[0].value.elements;

          const childNodes = childNode.properties.filter(property => {
            return property.key.value === 'childNodes';
          })[0].value;

          const attributeElements = [];

          // Check attributes.
          attributes.forEach(attribute => {
            const attrName = attribute.properties[0];
            const attrValue = attribute.properties[1];

            // Literal attribute value.
            const name = attrName.value.value;
            const value = attrValue.value.value;

            if (value === symbol) {
              attrValue.value = supplemental.props.shift();

              if (name === symbol) {
                attrName.value = attrValue.value;
              }
            }
            else if (value.indexOf(symbol) > -1) {
              let expr = makeConcatExpr(value, supplemental.props);
              attrValue.value = expr;
            }
            else {
              attrValue.value = t.stringLiteral(value);
            }

            if (name) {
              attributeElements.push(
                t.callExpression(createAttribute, [
                  attrName.value,
                  attrValue.value,
                ])
              );
            }
          });

          const args = [];

          // Real elements.
          if (nodeType === 1) {
            // Check childNodes.
            let expressions = childNodes.elements.map(
              c => t.expressionStatement(c)
            );

            // Replace the nested structures.
            replaceDynamicBits(expressions);

            args.push(createElement);
            args.push([
              nodeName,
              t.arrayExpression(attributeElements),
              t.arrayExpression(expressions.map(expr => expr.expression)),
            ]);
          }
          // Text nodes.
          else if (nodeType === 3) {
            let value = nodeValue.value || '';

            if (value.trim() === symbol) {
              statements[i].expression = supplemental.children.shift();
              return;
            }
            else if (value.indexOf(symbol) > -1) {
              args.push(createElement);
              args.push([
                t.stringLiteral('#text'),
                t.nullLiteral(),
                makeConcatExpr(value, supplemental.children)
              ]);
            }
            else {
              args.push(createElement);
              args.push([
                t.stringLiteral('#text'),
                t.nullLiteral(),
                nodeValue
              ]);
            }
          }

          statements[i].expression = t.callExpression.apply(null, args);
        });
      }

      replaceDynamicBits([].concat(vTree.program.body));

      if (vTree.program.body.length > 1) {
        path.replaceWith(t.arrayExpression(vTree.program.body.map(
          e => e.expression
        )));
      }
      else {
        path.replaceWith(vTree.program.body[0]);
      }
    }
  };

  return { visitor };
};

