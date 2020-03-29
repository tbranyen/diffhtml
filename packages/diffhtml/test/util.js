/// <reference types="mocha" />

import { ok, equal, deepEqual, throws, doesNotThrow } from 'assert';
import { spy } from 'sinon';
import createTree from '../lib/tree/create';
import { NodeCache } from '../lib/util/caches';
import decodeEntities from '../lib/util/decode-entities';
import escape from '../lib/util/escape';
import parse from '../lib/util/parse';
import _process from '../lib/util/process';
import { protectVTree, unprotectVTree, gc } from '../lib/util/memory';
import makeMeasure from '../lib/util/make-measure';
import Pool from '../lib/util/pool';
import validateMemory from './util/validate-memory';
import createSupplemental from './util/create-supplemental';

describe('Util', function() {
  let performance;

  beforeEach(() => {
    const mark = spy();
    const measure = spy();

    performance = /** @type {any} */(global).performance = {
      now: () => Date.now(),
      mark,
      measure,
    };
  });

  afterEach(() => {
    validateMemory();
    location.href = 'about:blank';
  });

  describe('DecodeEntities', () => {
    it('will pass simple strings through', () => {
      const string = decodeEntities('test');
      equal(string, 'test');
    });

    it('will decode an unencoded string', () => {
      const string = decodeEntities('&lt;p&gt;&lt;/p&gt;');
      equal(string, '<p></p>');
    });

    it('will decode an HTML5 encoded string', () => {
      const string = decodeEntities(`&gla;`);
      equal(string, '⪥');
    });
  });

  describe('Escape', () => {
    it('will prevent HTML elements from being injected', () => {
      const string = escape('<script>');
      equal(string, '&#60;script&#62;');
    });
  });

  describe('Parse', () => {
    it('will support empty attributes', () => {
      const vTree = parse('<option value="test" selected></option>').childNodes[0];

      equal(vTree.attributes.value, 'test');
      equal(vTree.attributes.selected, 'selected');
    });

    it('will support quote-less values', () => {
      const vTree = parse('<option value=test></option>').childNodes[0];
      equal(vTree.attributes.value, 'test');
    });

    it('will not parse whitespace from inside <html></html> tags', () => {
      const vTree = parse('<html>\n</html>').childNodes[0];

      equal(vTree.childNodes.length, 2);
    });

    it('will support simple text attributes alongside an empty attribute', () => {
      const vTree = parse('<option value="test" selected=""></option>').childNodes[0];

      equal(vTree.attributes.value, 'test');
      equal(vTree.attributes.selected, '');
    });

    it('will support spreading interpolated attribute objects', () => {
      const supplemental = createSupplemental({
        attributes: [{ value: 'test' }]
      })
      const vTree = parse('<option __DIFFHTML__0__></option>', supplemental).childNodes[0];

      equal(vTree.attributes.value, 'test');
    });

    it('will move elements found between the ends of body and html', () => {
      const vTree = parse(`
        <html>
          <body></body>
          <script></script>
        </html>
      `.trim()).childNodes[0];

      equal(vTree.childNodes.length, 2);
      equal(vTree.childNodes[0].nodeName, 'head');
      equal(vTree.childNodes[0].childNodes.length, 0);
      equal(vTree.childNodes[1].nodeName, 'body');
      equal(vTree.childNodes[1].childNodes.length, 1);
      equal(vTree.childNodes[1].childNodes[0].nodeName, 'script');
    });

    it('will move elements found before or after head and before body', () => {
      const vTree = parse(`
        <html>
          <script>test</script>
          <head></head>
          <script>this</script>
          <body></body>
          <p></p>
        </html>
      `.trim()).childNodes[0];

      equal(vTree.childNodes.length, 2);
      equal(vTree.childNodes[0].nodeName, 'head');
      equal(vTree.childNodes[0].childNodes.length, 2);
      equal(vTree.childNodes[0].childNodes[0].nodeName, 'script');
      equal(vTree.childNodes[0].childNodes[0].childNodes[0].nodeValue, 'test');
      equal(vTree.childNodes[0].childNodes[1].childNodes[0].nodeValue, 'this');
      equal(vTree.childNodes[1].nodeName, 'body');
      equal(vTree.childNodes[1].childNodes.length, 1);
      equal(vTree.childNodes[1].childNodes[0].nodeName, 'p');
    });

    it('will not support brackets in attribute values', () => {
      const vTree = parse(`<a data-text="<li class='test'></li>"></a>`).childNodes[0];

      equal(vTree.nodeName, 'a');
      equal(vTree.attributes['data-text'], '\"<li');
    });

    it('will parse text siblings next to elements', () => {
      const vTrees = parse(`<div></div> Hello world`).childNodes;

      equal(vTrees[0].nodeName, 'div');
      equal(vTrees[1].nodeName, '#text');
      equal(vTrees[1].nodeValue, ' Hello world');
    });

    it('will support parsing text before element', () => {
      const vTrees = parse(`Hello <div></div>`).childNodes;

      equal(vTrees.length, 2);
      equal(vTrees[0].nodeName, '#text');
      equal(vTrees[0].nodeValue, 'Hello ');
      equal(vTrees[1].nodeName, 'div');
    });

    it('will support parsing just text', () => {
      const vTrees = parse(`Hello`).childNodes;

      equal(vTrees.length, 1);
      equal(vTrees[0].nodeName, '#text');
      equal(vTrees[0].nodeValue, 'Hello');
    });

    it('will parse out full token attributes', () => {
      const token = '__DIFFHTML_BABEL__';
      const vTrees = parse(`<input ${token}/>`).childNodes;

      equal(vTrees[0].nodeName, 'input');
      deepEqual(vTrees[0].attributes, { [token]: token });
    });

    it('will parse out partial attributes', () => {
      const token = '__DIFFHTML__0__';
      const supplemental = {
        attributes: ['test'],
        tags: [],
        children: [],
      };
      const vTrees = parse(`<input value=${token}/>`, supplemental).childNodes;

      equal(vTrees[0].nodeName, 'input');
      deepEqual(vTrees[0].attributes, { value: 'test' });
    });

    it('will parse a key-only attribute', () => {
      const token = '__DIFFHTML__0__';
      const supplemental = {
        tags: [],
        attributes: ['disabled'],
        children: [],
      };
      const vTrees = parse(`<input ${token}/>`, supplemental).childNodes;

      equal(vTrees[0].nodeName, 'input');
      deepEqual(vTrees[0].attributes, { disabled: 'disabled' });
    });

    it('will support passing childNodes as an attribute', () => {
      const supplemental = createSupplemental({
        attributes: ['hello world']
      })
      const vTrees = parse(`<div childNodes=__DIFFHTML__0__ />`, supplemental).childNodes;

      deepEqual(vTrees[0].childNodes, [createTree('#text', 'hello world')]);
    });

    it('will support passing childNodes as an attribute to pave over existing children', () => {
      const supplemental = createSupplemental({
        attributes: ['hello world']
      });
      const vTrees = parse(`<div childNodes=__DIFFHTML__0__>test</div>`, supplemental).childNodes;

      deepEqual(vTrees[0].childNodes, [createTree('#text', 'hello world')]);
    });

    it('will ignore parsing doctypes', () => {
      const vTree = parse(`<!doctype html>`).childNodes[0];
      equal(vTree, undefined);
    });

    it('will support mixed cased elements being self closed', () => {
      const vTrees = parse(`<CustomElement
        attr="test"
        /><div>Hello world</div>`).childNodes;

      equal(vTrees[0].nodeName, 'customelement');
      deepEqual(vTrees[0].attributes, { attr: 'test' });
      equal(vTrees[1].nodeName, 'div');
      equal(vTrees[1].childNodes[0].nodeName, '#text');
      equal(vTrees[1].childNodes[0].nodeValue, 'Hello world');
    });

    it('will support passing custom self closing elements', () => {
      const vTrees = parse(`<div childNodes="test" />`, null, {
        parser: {
          strict: true,
          selfClosing: ['div'],
        }
      }).childNodes;

      equal(vTrees.length, 1);
      equal(vTrees[0].nodeName, 'div');
      equal(vTrees[0].childNodes[0].nodeName, '#text');
      equal(vTrees[0].childNodes[0].nodeValue, 'test');
    });

    it('will support passing custom block elements', () => {
      const vTrees = parse(`<div><p></p></div>`, null, {
        parser: {
          strict: true,
          blockText: ['div'],
        }
      }).childNodes;

      equal(vTrees.length, 1);
      equal(vTrees[0].nodeName, 'div');
      equal(vTrees[0].childNodes[0].nodeName, '#text');
      equal(vTrees[0].childNodes[0].nodeValue, '<p></p>');
    });

    it('will throw if arrays are tried to be spread as attributes', () => {
      const supplemental = createSupplemental({ attributes: [[]] })

      throws(
        () => parse(`<div __DIFFHTML__0__ />`, supplemental),
        /Arrays cannot be spread as attributes/
      );
    });

    it('will throw on invalid closing tag when in strict mode', () => {
      const opts = { parser: { strict: true } };
      const markup = `
        <span></span><div><div></div>
        <ul>
          <li>test</p>
        </ul>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      `;

      throws(
        () => parse(markup, null, opts),
        /Possibly invalid markup. <li> must be closed in strict mode./,
      );
    });

    it('will throw on invalid interpolated closing tag when in strict mode', () => {
      const opts = { parser: { strict: true } };
      const supplemental = createSupplemental({
        attributes: { 0: 'test' },
        tags: { 1: 'li', 2: 'p' },
      });
      const markup = `
        <span class=__DIFFHTML__0__></span><div><div></div>
        <ul>
          <__DIFFHTML__1__></li>
          <__DIFFHTML__2__>test</li>
        </ul>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      `;

      throws(
        () => parse(markup, supplemental, opts),
        /Possibly invalid markup. <p> must be closed in strict mode./,
      );
    });

    it('will not throw on invalid markup when strict mode is false', () => {
      doesNotThrow(() => {
        parse(`
          <span></span><div><div></div>
          <ul>
            <li>test</p>
          </ul>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        `, null, { parser: { strict: false } }).childNodes[0];
      });
    });

    it('will support nested elements within <pre>', () => {
      const vTrees = parse(`<pre><code></code></pre>`).childNodes;

      equal(vTrees[0].nodeName, 'pre');
      equal(vTrees[0].childNodes.length, 1);
      equal(vTrees[0].childNodes[0].nodeName, 'code');
    });

    it('will not support nested elements within <script>', () => {
      const vTrees = parse(`<script><pre></pre></script>`).childNodes;

      equal(vTrees[0].nodeName, 'script');
      equal(vTrees[0].childNodes.length, 1);
      equal(vTrees[0].childNodes[0].nodeName, '#text');
      equal(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will not support nested elements within <noscript>', () => {
      const vTrees = parse(`<noscript><pre></pre></noscript>`).childNodes;

      equal(vTrees[0].nodeName, 'noscript');
      equal(vTrees[0].childNodes.length, 1);
      equal(vTrees[0].childNodes[0].nodeName, '#text');
      equal(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will not support nested elements within <style>', () => {
      const vTrees = parse(`<style><pre></pre></style>`).childNodes;

      equal(vTrees[0].nodeName, 'style');
      equal(vTrees[0].childNodes.length, 1);
      equal(vTrees[0].childNodes[0].nodeName, '#text');
      equal(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will not support nested elements within <code>', () => {
      const vTrees = parse(`<code><pre></pre></code>`).childNodes;

      equal(vTrees[0].nodeName, 'code');
      equal(vTrees[0].childNodes.length, 1);
      equal(vTrees[0].childNodes[0].nodeName, '#text');
      equal(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will not support nested elements within <template>', () => {
      const vTrees = parse(`<template><pre></pre></template>`).childNodes;

      equal(vTrees[0].nodeName, 'template');
      equal(vTrees[0].childNodes.length, 1);
      equal(vTrees[0].childNodes[0].nodeName, '#text');
      equal(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will support self closing elements', () => {
      const vTrees = parse(`
        <meta/>
        <img/>
        <link/>
        <input/>
        <area/>
        <br/>
        <hr/>
      `.trim()).childNodes.filter(el => el.nodeType === 1);

      equal(vTrees.length, 7);
    });

    it('will support top-level interpolated string tag names', () => {
      const div = 'div';
      const supplemental = createSupplemental({ tags: [div] });
      const vTree = parse('<__DIFFHTML__0__ />', supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: div,
          nodeName: div,
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will support nested interpolated string tag names', () => {
      const div = 'div';
      const p = 'p';
      const supplemental = createSupplemental({ tags: [div, p] });
      const vTree = parse('<__DIFFHTML__0__><__DIFFHTML__1__ /></__DIFFHTML__0__>', supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: div,
          nodeName: div,
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            rawNodeName: p,
            nodeName: p,
            nodeValue: '',
            nodeType: 1,
            key: '',
            attributes: {},
            childNodes: [],
          }],
          attributes: {},
        }],
        attributes: {},
      });
    });


    it('will support function tag names, treating as fragment', () => {
      const Empty = () => {};
      const supplemental = createSupplemental({ tags: [Empty] });
      const vTree = parse('<__DIFFHTML__0__ />', supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: Empty,
          nodeName: '#document-fragment',
          nodeValue: '',
          nodeType: 11,
          key: '',
          childNodes: [],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will support closing custom tag names', () => {
      const Div = () => {};
      const supplemental = createSupplemental({ tags: [Div, Div] })
      const vTree = parse(`
        <__DIFFHTML__0__></__DIFFHTML__1__>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: Div,
          nodeName: '#document-fragment',
          nodeValue: '',
          nodeType: 11,
          key: '',
          childNodes: [],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will allow dynamic components to be closed', () => {
      const Component = () => {};
      const supplemental = createSupplemental({
        tags: [Component, Component],
      });
      const vTree = parse('<__DIFFHTML__0__>Hello world</__DIFFHTML__1__>', supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: Component,
          nodeName: '#document-fragment',
          nodeValue: '',
          nodeType: 11,
          key: '',
          childNodes: [{
            rawNodeName: '#text',
            nodeName: '#text',
            nodeValue: 'Hello world',
            nodeType: 3,
            key: '',
            childNodes: [],
            attributes: {},
          }],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will support interpolating children', () => {
      const text = createTree('#text', 'Hello world');
      const supplemental = createSupplemental({
        children: [text],
      })
      const vTree = parse(`
        <div>__DIFFHTML__0__</div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            attributes: {},
            childNodes: [],
            key: '',
            nodeName: '#text',
            nodeType: 3,
            nodeValue: 'Hello world',
            rawNodeName: '#text',
          }],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will support flattening fragments', () => {
      const fragment = createTree('#document-fragment', null,
        createTree('span', null, 'Hello world')
      );
      const supplemental = createSupplemental({ children: [fragment] });
      const vTree = parse(`
        <div>__DIFFHTML__0__</div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            rawNodeName: 'span',
            nodeName: 'span',
            nodeValue: '',
            nodeType: 1,
            key: '',
            childNodes: [{
              attributes: {},
              childNodes: [],
              key: '',
              nodeName: '#text',
              nodeType: 3,
              nodeValue: 'Hello world',
              rawNodeName: '#text',
            }],
            attributes: {},
          }],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will support interpolating between text', () => {
      const text = createTree('#text', 'world');
      const supplemental = createSupplemental({
        children: [text],
      })
      const vTree = parse(`
        <div>Hello __DIFFHTML__0__</div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            attributes: {},
            childNodes: [],
            key: '',
            nodeName: '#text',
            nodeType: 3,
            nodeValue: 'Hello ',
            rawNodeName: '#text',
          }, {
            attributes: {},
            childNodes: [],
            key: '',
            nodeName: '#text',
            nodeType: 3,
            nodeValue: 'world',
            rawNodeName: '#text',
          }],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will ignore empty children', () => {
      const supplemental = createSupplemental({ children: [undefined] })
      const vTree = parse(`
        <div>Hello __DIFFHTML__0__</div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            attributes: {},
            childNodes: [],
            key: '',
            nodeName: '#text',
            nodeType: 3,
            nodeValue: 'Hello ',
            rawNodeName: '#text',
          }],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will interpolate a single attribute', () => {
      const className = 'test';
      const supplemental = createSupplemental({
        attributes: [className],
      })
      const vTree = parse(`
        <div class=__DIFFHTML__0__></div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {
            class: className,
          },
        }],
        attributes: {},
      });
    });

    it('will interpolate an attribute without a value', () => {
      const checked = 'checked';
      const supplemental = createSupplemental({
        attributes: [checked],
      })
      const vTree = parse(`
        <div __DIFFHTML__0__></div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {
            checked,
          },
        }],
        attributes: {},
      });
    });

    it('will interpolate multiple attributes', () => {
      const className = 'test';
      const dataTest = 'fixture';
      const supplemental = createSupplemental({
        attributes: [className, dataTest],
      })
      const vTree = parse(`
        <div class=__DIFFHTML__0__ data-test=__DIFFHTML__1__></div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {
            class: className,
            'data-test': dataTest,
          },
        }],
        attributes: {},
      });
    });

    it('will interpolate multiple values into a single attribute', () => {
      const hello = 'hello';
      const world = 'world';
      const supplemental = createSupplemental({
        attributes: [hello, world],
      })
      const vTree = parse(`
        <div class="__DIFFHTML__0__-__DIFFHTML__1__"></div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {
            class: 'hello-world',
          },
        }],
        attributes: {},
      });
    });

    it('will interpolate an attribute with an empty string', () => {
      const key = 'key';
      const supplemental = createSupplemental({
        attributes: [key],
      })
      const vTree = parse(`
        <div __DIFFHTML__0__=""></div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {
            [key]: '',
          },
        }],
        attributes: {},
      });
    });

    it('will interpolate an attribute with empty single quotes', () => {
      const key = 'key';
      const supplemental = createSupplemental({
        attributes: [key],
      })
      const vTree = parse(`
        <div __DIFFHTML__0__=''></div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {
            [key]: '',
          },
        }],
        attributes: {},
      });
    });

    it('will interpolate an attribute with an empty value', () => {
      const key = 'key';
      const value = '';
      const supplemental = createSupplemental({
        attributes: [key, value],
      })
      const vTree = parse(`
        <div __DIFFHTML__0__=__DIFFHTML__1__></div>
      `.trim(), supplemental);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'div',
          nodeName: 'div',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {
            [key]: '',
          },
        }],
        attributes: {},
      });
    });

    it('will ignore parsing comments until a later version', () => {
      const vTree = parse('<!-- Test -->Test');

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: '#text',
          nodeName: '#text',
          nodeValue: 'Test',
          nodeType: 3,
          key: '',
          childNodes: [],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will support elements that can optionally omit a close tag', () => {
      const vTree = parse(`
        <li>Hello
        <li>World
      `.trim());

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'li',
          nodeName: 'li',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            rawNodeName: '#text',
            nodeName: '#text',
            nodeValue: 'Hello\n        ',
            nodeType: 3,
            key: '',
            childNodes: [],
            attributes: {},
          }],
          attributes: {},
        }, {
          rawNodeName: 'li',
          nodeName: 'li',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            rawNodeName: '#text',
            nodeName: '#text',
            nodeValue: 'World',
            nodeType: 3,
            key: '',
            childNodes: [],
            attributes: {},
          }],
          attributes: {},
        }],
        attributes: {},
      });
    });

    it('will support malformed markup just like DOMParser', () => {
      const vTree = parse(`
        <li>Hello</ol>
        <li>World</ol>
      `.trim());

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'li',
          nodeName: 'li',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            rawNodeName: '#text',
            nodeName: '#text',
            nodeValue: 'Hello',
            nodeType: 3,
            key: '',
            childNodes: [],
            attributes: {}
          }],
          attributes: {}
        }, {
          rawNodeName: '#text',
          nodeName: '#text',
          nodeValue: '\n        ',
          nodeType: 3,
          key: '',
          childNodes: [],
          attributes: {},
        }, {
          rawNodeName: 'li',
          nodeName: 'li',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [{
            rawNodeName: '#text',
            nodeName: '#text',
            nodeValue: 'World',
            nodeType: 3,
            key: '',
            childNodes: [],
            attributes: {}
          }],
          attributes: {}
        }],
        attributes: {}
      });
    });

    it('will support parsing malformed markup with not closing', () => {
      const vTree = parse(`<script>`);

      deepEqual(vTree, {
        rawNodeName: '#document-fragment',
        nodeName: '#document-fragment',
        nodeValue: '',
        nodeType: 11,
        key: '',
        childNodes: [{
          rawNodeName: 'script',
          nodeName: 'script',
          nodeValue: '',
          nodeType: 1,
          key: '',
          childNodes: [],
          attributes: {}
        }],
        attributes: {},
      });
    });

    it('will correctly parse surrounding text nodes', () => {
      const vTree = parse(`<div>
    <h1>Attach/Detach Template</h1>
</div>`);

      deepEqual(vTree, {
          rawNodeName: '#document-fragment',
          nodeName: '#document-fragment',
          nodeValue: '',
          nodeType: 11,
          key: '',
          childNodes: [{
              "rawNodeName": "div",
              "nodeName": "div",
              "nodeValue": "",
              "nodeType": 1,
              "key": "",
              "childNodes": [
                  {
                      "rawNodeName": "#text",
                      "nodeName": "#text",
                      "nodeValue": "\n    ",
                      "nodeType": 3,
                      "key": "",
                      "childNodes": [],
                      "attributes": {}
                  },
                  {
                      "rawNodeName": "h1",
                      "nodeName": "h1",
                      "nodeValue": "",
                      "nodeType": 1,
                      "key": "",
                      "childNodes": [
                          {
                              "rawNodeName": "#text",
                              "nodeName": "#text",
                              "nodeValue": "Attach/Detach Template",
                              "nodeType": 3,
                              "key": "",
                              "childNodes": [],
                              "attributes": {}
                          }
                      ],
                      "attributes": {}
                  },
                  {
                      "rawNodeName": "#text",
                      "nodeName": "#text",
                      "nodeValue": "\n",
                      "nodeType": 3,
                      "key": "",
                      "childNodes": [],
                      "attributes": {}
                  }
              ],
              "attributes": {}
          }],
          attributes: {},
      });
    });

    it('will correctly parse hard return text node', () => {
      const vTree = parse(`<code>
</code>`).childNodes[0];

      deepEqual(vTree, {
        "attributes": {},
        "childNodes": [
          {
            "rawNodeName": "#text",
            "nodeName": "#text",
            "nodeValue": "\n",
            "nodeType": 3,
            "key": "",
            "childNodes": [],
            "attributes": {}
          }
        ],
        "key": "",
        "nodeName": "code",
        "nodeType": 1,
        "nodeValue": "",
        "rawNodeName": "code"
      });
    });
  });

  describe('Pool', () => {
    it('will create additional shapes if the pool is exceeded', () => {
      let shape = null;

      for (let i = 0; i < Pool.size + 1; i++) {
        shape = createTree('div');
      }

      equal(Pool.memory.free.size, 0);
      equal(Pool.memory.allocated.size, Pool.size + 1);

      gc();

      equal(Pool.memory.free.size, Pool.size + 1);
      equal(Pool.memory.allocated.size, 0);

      Pool.memory.free.delete(shape);

      equal(Pool.memory.free.size, Pool.size);
    });
  });

  describe('Memory', () => {
    it('will protect and unprotect a VTree through garbage collection', () => {
      const vTree = createTree('div');

      protectVTree(vTree);
      gc();

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.size, 1);

      unprotectVTree(vTree);
      gc();

      equal(Pool.memory.free.size, Pool.size);
      equal(Pool.memory.protected.size, 0);
    });

    it('will protect and unprotect nested VTrees', () => {
      const vTree = createTree('div', null, createTree('span'));

      protectVTree(vTree);
      gc();

      equal(Pool.memory.free.size, Pool.size - 2);
      equal(Pool.memory.protected.size, 2);

      unprotectVTree(vTree);
      gc();

      equal(Pool.memory.free.size, Pool.size);
      equal(Pool.memory.protected.size, 0);
    });

    it('will "garbage collect" unprotected VTrees', () => {
      const vTree = createTree('div', null, createTree('span'));

      protectVTree(vTree);
      unprotectVTree(vTree.childNodes[0]);
      gc();

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.size, 1);
      equal(Pool.memory.free.has(vTree.childNodes[0]), true);

      unprotectVTree(vTree);
      gc();

      equal(Pool.memory.free.size, Pool.size);
      equal(Pool.memory.protected.size, 0);
    });

    it('will garbage collect DOM Node associations', () => {
      const domNode = document.createElement('div');
      const vTree = createTree(domNode);

      protectVTree(vTree);

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.has(vTree), true);

      gc();

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.has(vTree), true);

      unprotectVTree(vTree);
      gc();

      let cacheHasNode = false;

      NodeCache.forEach((/** @type {HTMLElement} */node) => {
        if (node === domNode) {
          cacheHasNode = true;
        }
      })

      equal(cacheHasNode, false);
    });
  });

  describe('Performance', () => {
    it(`will return a NOP when the user doesn't have search`, () => {
      const div = document.createElement('div');
      const vTree = createTree(div);
      const measure = makeMeasure(div, vTree);

      equal(measure.name, 'nop');
    });

    it(`will return a NOP when the user has search, but no diff`, () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      location.href = 'about:blank?';

      const measure = makeMeasure(div, vTree);
      equal(measure.name, 'nop');
    });

    it('will return a real measure function if requested', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      location.href = 'about:blank?diff_perf';

      const measure = makeMeasure(div, vTree);

      equal(measure.name, '');
      equal(measure.length, 1);
    });

    it('will use performance.mark on the first call', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      location.href = 'about:blank?diff_perf';

      const measure = makeMeasure(div, vTree);

      measure('test-1');

      equal(performance.mark.calledOnce, true);
      deepEqual(performance.mark.firstCall.args, ['test-1']);
    });

    it('will use performance.measure on the second call', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      location.href = 'about:blank?diff_perf';

      const measure = makeMeasure(div, vTree);

      measure('test-2');
      measure('test-2');

      equal(performance.measure.callCount, 1);
      deepEqual(performance.mark.firstCall.args, ['test-2']);
      deepEqual(performance.mark.lastCall.args, ['test-2-end']);
      deepEqual(performance.measure.firstCall.args.slice(1), [
        'test-2',
        'test-2-end',
      ]);

      const regex = /diffHTML test-2 \((.*)ms\)/;
      ok(regex.exec(performance.measure.firstCall.args[0]));
    });

    it('will log out web component names', () => {
      const div = document.createElement('div');
      /** @type {any} */ (div).host = { constructor: { name: 'Component' } };
      const vTree = createTree(div);

      location.href = 'about:blank?diff_perf';

      const measure = makeMeasure(div, vTree);

      measure('test-3');
      measure('test-3');

      equal(performance.measure.callCount, 1);
      deepEqual(performance.mark.firstCall.args, ['Component test-3']);
      deepEqual(performance.mark.lastCall.args, ['Component test-3-end']);
      deepEqual(performance.measure.firstCall.args.slice(1), [
        'Component test-3',
        'Component test-3-end',
      ]);

      const regex = /diffHTML Component test-3 \((.*)ms\)/;
      ok(regex.exec(performance.measure.firstCall.args[0]));
    });

    it('will log out tagName component names', () => {
      class Component {}
      const div = document.createElement('div');
      const vTree = createTree(Component);

      location.href = 'about:blank?diff_perf';

      const measure = makeMeasure(div, vTree);

      measure('test-4');
      measure('test-4');

      equal(performance.measure.callCount, 1);
      deepEqual(performance.mark.firstCall.args, ['Component test-4']);
      deepEqual(performance.mark.lastCall.args, ['Component test-4-end']);
      deepEqual(performance.measure.firstCall.args.slice(1), [
        'Component test-4',
        'Component test-4-end',
      ]);

      const regex = /diffHTML Component test-4 \((.*)ms\)/;
      ok(regex.exec(performance.measure.firstCall.args[0]));
    });
  });

  describe('Process', () => {
    it('it matches the global process', () => {
      equal(_process, global.process);
    });
  });
});
