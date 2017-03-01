import { changeURL } from 'jsdom';
import { ok, equal, deepEqual, throws, doesNotThrow } from 'assert';
import { spy } from 'sinon';
import { createTree } from '../lib/tree';
import {
  NodeCache,
  decodeEntities,
  escape,
  parse,
  namespace,
  elements,
  protectVTree,
  unprotectVTree,
  cleanMemory,
  makeMeasure,
  Pool,
} from '../lib/util';
import validateMemory from './util/validateMemory';

describe('Util', function() {
  beforeEach(() => {
    global.performance = {
      now: () => Date.now(),
      mark: spy(),
      measure: spy(),
    };
  });

  afterEach(() => {
    validateMemory();
    changeURL(window, 'about:blank');
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

  describe('Parser', () => {
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

    it('will move elements found between the ends of body and html', () => {
      const vTree = parse(`
        <html>
          <body></body>
          <script></script>
        </html>
      `).childNodes[0];

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
      `).childNodes[0];

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
      equal(vTrees[1].nodeValue, 'Hello world');
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
      var token = '__DIFFHTML_BABEL__';
      const vTrees = parse(`<input ${token}/>`).childNodes;

      equal(vTrees[0].nodeName, 'input');
      deepEqual(vTrees[0].attributes, { [token]: token });
    });

    it('will ignore parsing doctypes', () => {
      const vTrees = parse(`<!doctype html>`).childNodes[0];
      equal(vTrees, undefined);
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

    it('will throw on invalid markup, when in strict mode', () => {
      throws(e => {
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
        `, null, { strict: true }).childNodes[0];

        equal(ex.message,
          "</p>\n^\nPossibly invalid markup. Saw p, expected li...\n        \n      </ul>\n      <div></div>"
        );
      });
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
        `, null, { strict: false }).childNodes[0];
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

    it('will support custom tag names, treating as fragment', () => {
      const Div = () => {};
      const vTree = parse('<__DIFFHTML__0__ />', { tags: { 0: Div } });

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

    it('will support closing custom tag names', () => {
      const Div = () => {};
      const vTree = parse(`
        <__DIFFHTML__0__></__DIFFHTML__1__>
      `, { tags: { 0: Div, 1: Div } });

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
      const vTree = parse('<__DIFFHTML__0__>Hello world</__DIFFHTML__1__>', {
        tags: { 0: Component, 1: Component },
      });

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
      const vTree = parse(`
        <div>__DIFFHTML__0__</div>
      `, { children: { 0: text } });

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

      const vTree = parse(`
        <div>__DIFFHTML__0__</div>
      `, { children: { 0: fragment } });

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
      const vTree = parse(`
        <div>Hello __DIFFHTML__0__</div>
      `, { children: { 0: text } });

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
      const vTree = parse(`
        <div>Hello __DIFFHTML__0__</div>
      `, { children: { 0: undefined } });

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
      const vTree = parse(`
        <div class=__DIFFHTML__0__></div>
      `, { attributes: { 0: className } });

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
      const vTree = parse(`
        <div __DIFFHTML__0__></div>
      `, { attributes: { 0: checked } });

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
      const vTree = parse(`
        <div class=__DIFFHTML__0__ data-test=__DIFFHTML__1__></div>
      `, { attributes: { 0: className, 1: dataTest } });

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

    it('will interpolate multiple attributes', () => {
      const hello = 'hello';
      const world = 'world';
      const vTree = parse(`
        <div class="__DIFFHTML__0__-__DIFFHTML__1__"></div>
      `, { attributes: { 0: hello, 1: world } });

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
      const value = 'value';
      const vTree = parse(`
        <div __DIFFHTML__0__=""></div>
      `, { attributes: { 0: value } });

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
            value: '',
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
      `);

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
      `);

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
  });

  describe('SVG', () => {
    it('exports a list of valid SVG elements', () => {
      ok(Array.isArray(elements));
      ok(elements.length);
    });

    it('exports the SVG namespace', () => {
      equal(namespace, 'http://www.w3.org/2000/svg');
    });
  });

  describe('Memory', () => {
    it('will protect and unprotect a VTree through garbage collection', () => {
      const vTree = createTree('div');

      protectVTree(vTree);
      cleanMemory();

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.size, 1);

      unprotectVTree(vTree);
      cleanMemory();

      equal(Pool.memory.free.size, Pool.size);
      equal(Pool.memory.protected.size, 0);
    });

    it('will protect and unprotect nested VTrees', () => {
      const vTree = createTree('div', null, createTree('span'));

      protectVTree(vTree);
      cleanMemory();

      equal(Pool.memory.free.size, Pool.size - 2);
      equal(Pool.memory.protected.size, 2);

      unprotectVTree(vTree);
      cleanMemory();

      equal(Pool.memory.free.size, Pool.size);
      equal(Pool.memory.protected.size, 0);
    });

    it('will "garbage collect" unprotected VTrees', () => {
      const vTree = createTree('div', null, createTree('span'));

      protectVTree(vTree);
      unprotectVTree(vTree.childNodes[0]);
      cleanMemory();

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.size, 1);
      equal(Pool.memory.free.has(vTree.childNodes[0]), true);

      unprotectVTree(vTree);
      cleanMemory();

      equal(Pool.memory.free.size, Pool.size);
      equal(Pool.memory.protected.size, 0);
    });

    it('will garbage collect DOM Node associations', () => {
      const domNode = document.createElement('div');
      const vTree = createTree(domNode);

      protectVTree(vTree);

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.has(vTree), true);

      cleanMemory();

      equal(Pool.memory.free.size, Pool.size - 1);
      equal(Pool.memory.protected.has(vTree), true);

      unprotectVTree(vTree);
      cleanMemory();

      equal(NodeCache.has(domNode), false);
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

      changeURL(window, 'about:blank?')

      const measure = makeMeasure(div, vTree);
      equal(measure.name, 'nop');
    });

    it('will return a real measure function if requested', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      changeURL(window, 'about:blank?diff_perf')

      const measure = makeMeasure(div, vTree);

      equal(measure.name, '');
      equal(measure.length, 1);
    });

    it('will use performance.mark on the first call', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      changeURL(window, 'about:blank?diff_perf')

      const measure = makeMeasure(div, vTree);

      measure('test-1');

      equal(performance.mark.calledOnce, true);
      deepEqual(performance.mark.firstCall.args, ['test-1']);
    });

    it('will use performance.measure on the second call', () => {
      const div = document.createElement('div');
      const vTree = createTree(div);

      changeURL(window, 'about:blank?diff_perf')

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
      div.host = { constructor: { name: 'Component' } };
      const vTree = createTree(div);

      changeURL(window, 'about:blank?diff_perf')

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

      changeURL(window, 'about:blank?diff_perf')

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
});
