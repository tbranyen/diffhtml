import { Internals } from 'diffhtml';
import * as babylon from 'babylon';

const { parse } = Internals;
const hasNonWhitespaceEx = /\S/;
const TOKEN = '__DIFFHTML_BABEL__';
const doctypeEx = /<!.*>/i;
const tokenEx = /__DIFFHTML_BABEL__([^_]*)__/;
const isPropEx = /(=|'|")/;
const isAttributeEx = /(=|"|')[^><]*?$/;
const isTagEx = /(<|\/)/;

/**
 * Transpiles a matching tagged template literal to createTree calls, the
 * end goal avoids HTML parsing at runtime.
 *
 * @return {Object} containing the visitor handler.
 */
export default function({ types: t }) {
  const interpolateValues = (string, supplemental, createTree) => {
    // If this is text and not a doctype, add as a text node.
    if (string && !doctypeEx.test(string) && !tokenEx.test(string)) {
      return t.arrayExpression([t.stringLiteral('#text'), t.stringLiteral(string)]);
    }

    const childNodes = [];
    const parts = string.split(tokenEx);
    let { length } = parts;

    for (let i = 0; i < length; i++) {
      const value = parts[i];

      // When we split on the token expression, the capture group will replace
      // the token's position. So all we do is ensure that we're on an odd
      // index and then we can source the correct value.
      if (i % 2 === 1) {
        const innerTree = supplemental.children[value];
        const isFragment = innerTree.nodeType === 11;

        if (typeof innerTree.rawNodeName === 'string' && isFragment) {
          childNodes.push(...innerTree.childNodes);
        }
        else {
          if (innerTree.type === 'StringLiteral' || innerTree.type === 'NumberLiteral') {
            childNodes.push(t.callExpression(createTree, [t.stringLiteral('#text'), innerTree]));
          }
          else {
            childNodes.push(innerTree);
          }
        }
      }
      else if (!doctypeEx.test(value)) {
        childNodes.push(t.callExpression(createTree, [t.stringLiteral('#text'), t.stringLiteral(value)]));
      }
    }

    let retVal = null;

    // If no children were present, send back an empty text node.
    if (childNodes.length === 0) {
      retVal = t.callExpression(
        createTree,
        [t.stringLiteral('#text'), t.stringLiteral('')],
      );
    }
    // Wrap multiple nodes in a fragment.
    else if (childNodes.length > 1) {
      retVal = t.callExpression(createTree, [
        t.stringLiteral('#document-fragment'),
        t.arrayExpression(childNodes),
      ]);
    }
    else {
      retVal = childNodes[0];
    }

    return t.arrayExpression([retVal]);
  };

  // Takes in a dot-notation identifier and breaks it up into a
  // MemberExpression. Useful for configuration overrides specifying the
  // tagged template function name and createTree calls.
  const identifierToMemberExpression = identifier => {
    const identifiers = identifier.split('.');

    if (identifiers.length === 0) {
      return;
    }
    else if (identifiers.length === 1) {
      return t.identifier(identifiers[0]);
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

  // The inverse of identifierToMemberExpression, this takes in a
  // memberexpression and converts to dot notation. Useful for comparing the
  // configuration value to the real MemberExpression value.
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
      let strict = false;

      if (path.node.tag.type === 'Identifier') {
        tagName = path.node.tag.name
      }
      else if (path.node.tag.type === 'MemberExpression') {
        tagName = memberExpressionToString(path.node.tag);
      }

      if (tagName.indexOf((plugin.opts.tagName || 'html')) !== 0) {
        return;
      }

      if (tagName === `${plugin.opts.tagName || 'html'}.strict`) {
        strict = true;
      }

      const supplemental = {
        attributes: {},
        children: {},
        tags: {},
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

      // Used to store markup and tokens.
      let HTML = '';
      const dynamicBits = [];

      // Nearly identical logic to the diffHTML parser, as we have the static
      // vs dynamic parts pre-separated for us and we simply need to fuse them
      // together.
      quasis.forEach((quasi, i) => {
        HTML += quasi.value.raw;

        if (expressions.length) {
          const expression = expressions.shift();
          const lastSegment = HTML.split(' ').pop();
          const lastCharacter = lastSegment.trim().slice(-1);
          const isAttribute = Boolean(HTML.match(isAttributeEx));
          const isTag = Boolean(lastCharacter.match(isTagEx));
          const isString = expression.type === 'StringLiteral';
          const isObject = expression.type === 'ObjectExpression';
          const isArray = expression.type === 'ArrayExpression';
          const isIdentifier = expression.type === 'Identifier';
          const token = TOKEN + i + '__';

          // Injected as attribute.
          if (isAttribute) {
            supplemental.attributes[i] = expression;
            HTML += token;
          }
          // Injected as a tag.
          else if (isTag && !isString) {
            supplemental.tags[i] = expression;
            HTML += token;
          }
          // Injected as a child node.
          else if (expression) {
            let string = HTML[HTML.length - 1] || '';
            let lastSegment = string.split(' ').pop();
            let lastCharacter = lastSegment.trim().slice(-1);
            let isProp = Boolean(lastCharacter.match(isPropEx));

            let lastStart = HTML.lastIndexOf('<');
            let lastEnd = HTML.lastIndexOf('>');

            if (lastEnd === -1 && lastStart !== -1) {
              isProp = true;
            }
            else if (lastEnd > lastStart) {
              isProp = false;
            }
            else if (lastEnd < lastStart) {
              isProp = true;
            }

            const token = TOKEN + i + '__';

            HTML += token;

            if (isProp) {
              supplemental.attributes[i] = expression;
            }
            else {
              supplemental.children[i] = expression;
            }
          }
        }
      });

      const root = parse(HTML, null, { strict }).childNodes;
      const strRoot = JSON.stringify(root.length === 1 ? root[0] : root);
      const vTree = babylon.parse('(' + strRoot + ')');

      const createTree = plugin.opts.createTree ?
        identifierToMemberExpression(plugin.opts.createTree) :
        identifierToMemberExpression('diff.createTree');

      /**
       * Replace the dynamic parts of the AST with the actual quasi
       * expressions.
       *
       * @param statements
       */
      function replaceDynamicBits(statements) {
        var isDynamic = false;

        statements.forEach((statement, i) => {
          const childNode = statement.expression;

          if (childNode.type === 'ArrayExpression') {
            let newAst = childNode.elements.map(e => t.expressionStatement(e));
            let _isDynamic = replaceDynamicBits(newAst);
            if (_isDynamic) { isDynamic = true; }
            childNode.elements = newAst.map(e => e.expression);

            return;
          }

          // The nodeName without `toLowerCase()` being called on it.
          const rawNodeName = childNode.properties.filter(property => {
            return property.key.value === 'rawNodeName';
          })[0].value;

          // Extract
          const identifierIsInScope = path.scope.hasBinding(rawNodeName.value);

          const nodeType = childNode.properties.filter(property => {
            return property.key.value === 'nodeType';
          })[0].value.value;

          const nodeValue = childNode.properties.filter(property => {
            return property.key.value === 'nodeValue';
          })[0].value;

          const attributes = childNode.properties.filter(property => {
            return property.key.value === 'attributes';
          })[0].value;

          const childNodes = childNode.properties.filter(property => {
            return property.key.value === 'childNodes';
          })[0].value;

          const args = [];

          // Remaps the supplemental values inline. This will strip out the
          // tokens and inject.
          attributes.properties.forEach((property, i, properties) => {
            const keysMatched = property.key.value.split(tokenEx);
            const valuesMatched = property.value.value.split(tokenEx);

            const keys = [];
            const values = [];

            let key;
            let value;

            // Build up the key.
            for (let i = 0; i < keysMatched.length; i++) {
              const match = keysMatched[i];

              if (i % 2 === 1) {
                keys.push(supplemental.attributes[match]);
              }
              else if (match) {
                keys.push(t.stringLiteral(match));
              }
            }

            key = keys.reduce((memo, curr) => {
              if (!memo) {
                return curr;
              }

              return t.binaryExpression('+', memo, curr);
            }, null);

            // Build up the value.
            for (let i = 0; i < valuesMatched.length; i++) {
              const match = valuesMatched[i];

              if (i % 2 === 1) {
                values.push(supplemental.attributes[match]);
              }
              else if (match) {
                values.push(t.stringLiteral(match));
              }
            }

            value = values.reduce((memo, curr) => {
              if (!memo) {
                return curr;
              }

              return t.binaryExpression('+', memo, curr);
            }, null);

            properties[i] = t.objectProperty(
              keys.length ? key : property.key,
              values.length ? value : property.value,
              Boolean(keys.length),
            );
          });

          // Real elements.
          if (nodeType === 1) {
            // Check childNodes.
            let expressions = childNodes.elements.map(
              c => t.expressionStatement(c)
            );

            // Replace the nested structures.
            let _isDynamic = replaceDynamicBits(expressions);

            // Only set if true.
            if (_isDynamic) {
              isDynamic = true;
            }

            const token = rawNodeName.value.match(tokenEx);

            args.push(createTree, [
              identifierIsInScope ? t.identifier(rawNodeName.value) : (token ? supplemental.tags[token[1]] : rawNodeName),
              attributes,
              t.arrayExpression(expressions.map(expr => expr.expression)),
            ]);
          }
          // Text nodes.
          else if (nodeType === 3) {
            let value = nodeValue.value || '';

            if (value.match(tokenEx)) {
              const values = interpolateValues(value, supplemental, createTree);

              if (values.elements.length === 1) {
                args.replacement = values.elements[0];
              }
              else {
                args.push(createTree, [t.stringLiteral('#document-fragment'), values]);
              }

              isDynamic = true;
            }
            else {
              let id = path.scope.generateUidIdentifier('vtree');

              path.scope.parent.push({
                id,
                init: t.callExpression(createTree, [
                  t.stringLiteral('#text'),
                  nodeValue,
                ]),
              });

              args.replacement = t.callExpression(createTree, [
                t.stringLiteral('#text'),
                nodeValue,
              ]);
            }
          }

          const callExpr = args.replacement || t.callExpression.apply(null, args);

          // TODO This will determine if the Node is embedded in a dynamic call
          // in which case it cannot be hoisted.
          const isTopLevelStatic = false;

          // Is a static node and never changes, so hoist createTree call.
          if (!isDynamic && isTopLevelStatic) {
            let id = path.scope.generateUidIdentifier('vtree');
            path.scope.parent.push({ id, init: callExpr });
            statements[i].expression = id;
          }
          else {
            statements[i].expression = callExpr;
          }
        });

        return isDynamic;
      }

      replaceDynamicBits([...vTree.program.body]);

      //if (vTree.program.body.length > 1) {
      if (t.isArrayExpression(vTree.program.body[0].expression)) {
        path.replaceWith(
          t.callExpression(
            createTree,
            [
              t.stringLiteral('#document-fragment'),
              vTree.program.body[0].expression,
            ],
          ),
        );
      }
      else {
        path.replaceWith(vTree.program.body[0]);
      }
    }
  };

  return { visitor };
};
