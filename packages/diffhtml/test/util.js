import { ok, strictEqual, deepStrictEqual, throws, doesNotThrow } from 'assert';
import { spy } from 'sinon';
import createTree from '../lib/tree/create';
import { NodeCache } from '../lib/util/types';
import decodeEntities from '../lib/util/decode-entities';
import escape from '../lib/util/escape';
import parse from '../lib/util/parse';
import _process from '../lib/util/process';
import { protectVTree, unprotectVTree, gc } from '../lib/util/memory';
import makeMeasure from '../lib/util/make-measure';
import Pool from '../lib/util/pool';
import getConfig from '../lib/util/config';
import validateMemory from './util/validate-memory';
import createSupplemental from './util/create-supplemental';

const { floor } = Math;
const { stringify } = JSON;

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

  describe('Config', () => {
    it('will load boolean type from process.env', () => {
      process.env.DIFF_TESTBOOL = 'true';

      const actual = getConfig('test_bool', false);
      strictEqual(actual, true);
    });

    it('will load boolean type from search params', () => {
      location.search = '?diff_testbool=true';

      const actual = getConfig('test_bool', false);
      strictEqual(actual, true);
    });

    it('will load string type from process.env', () => {
      process.env.DIFF_TESTSTR = 'some-str';

      const actual = getConfig('test_str', '');
      strictEqual(actual, 'some-str');
    });

    it('will load string type from search params', () => {
      location.search = '?diff_teststr=test-str';

      const actual = getConfig('test_str', '');
      strictEqual(actual, 'some-str');
    });

    it('will load number type from process.env', () => {
      process.env.DIFF_TESTNUM = '144';

      const actual = getConfig('test_num', -1);
      strictEqual(actual, 144);
    });

    it('will load number type from search params', () => {
      location.search = '?diff_testnum=144';

      const actual = getConfig('test_num', -1);
      strictEqual(actual, 144);
    });

    it('will load object type from process.env', () => {
      process.env.DIFF_TESTOBJ = stringify({ 1: true, 2: false });

      const actual = getConfig('test_obj', {});
      deepStrictEqual(actual, { 1: true, 2: false });
    });

    it('will load object type from search params', () => {
      location.search = `?diff_testobj=${stringify({ 1: true, 2: false })}`;

      const actual = getConfig('test_obj', {});
      deepStrictEqual(actual, { 1: true, 2: false });
    });

    it('will not error if not in a browser env', () => {
      const oldLocation = global.location;

      delete global.location;

      strictEqual(getConfig('t', 1), 1);

      global.location = oldLocation;
    });
  });

  describe('DecodeEntities', () => {
    it('will pass simple strings through', () => {
      const string = decodeEntities('test');
      strictEqual(string, 'test');
    });

    it('will decode an unencoded string', () => {
      const string = decodeEntities('&lt;p&gt;&lt;/p&gt;');
      strictEqual(string, '<p></p>');
    });

    it('will decode an HTML5 encoded string', () => {
      const string = decodeEntities(`&gla;`);
      strictEqual(string, '⪥');
    });
  });

  describe('Escape', () => {
    it('will prevent HTML elements from being injected', () => {
      const string = escape('<script>');
      strictEqual(string, '&#60;script&#62;');
    });
  });

  describe('Parse', () => {
    it('will support single line parsing', () => {
      const vTree = parse('<a href="#"><img src="#"></a>').childNodes[0];

      strictEqual(vTree.nodeName, 'a');
      strictEqual(vTree.attributes.href, '#');
      strictEqual(vTree.childNodes[0].nodeName, 'img');
      strictEqual(vTree.childNodes[0].attributes.src, '#');
    });

    it('will support empty attributes', () => {
      const vTree = parse('<option value="test" selected></option>').childNodes[0];

      strictEqual(vTree.attributes.value, 'test');
      strictEqual(vTree.attributes.selected, 'selected');
    });

    it('will support quote-less values', () => {
      const vTree = parse('<option value=test></option>').childNodes[0];
      strictEqual(vTree.attributes.value, 'test');
    });

    it('will not parse whitespace from inside <html></html> tags', () => {
      const vTree = parse('<html>\n</html>').childNodes[0];

      strictEqual(vTree.childNodes.length, 2);
    });

    it('will support simple text attributes alongside an empty attribute', () => {
      const vTree = parse('<option value="test" selected=""></option>').childNodes[0];

      strictEqual(vTree.attributes.value, 'test');
      strictEqual(vTree.attributes.selected, '');
    });

    it('will support HTML comments inside script tags', () => {
      const vTree = parse('<script>before<!-- in -->after</script>').childNodes[0];
      strictEqual(vTree.childNodes[0].nodeValue, 'before<!-- in -->after');
    });

    it('will support dot attributes', () => {
      const vTree = parse('<option dot.value="test" />').childNodes[0];

      strictEqual(vTree.attributes['dot.value'], 'test');
    });

    it('will support spreading interpolated attribute objects', () => {
      const supplemental = createSupplemental({
        attributes: [{ value: 'test' }]
      })
      const vTree = parse('<option __DIFFHTML__0__></option>', supplemental).childNodes[0];

      strictEqual(vTree.attributes.value, 'test');
    });

    it('will move elements found between the ends of body and html', () => {
      const vTree = parse(`
        <html>
          <body></body>
          <script></script>
        </html>
      `.trim()).childNodes[0];

      strictEqual(vTree.childNodes.length, 2);
      strictEqual(vTree.childNodes[0].nodeName, 'head');
      strictEqual(vTree.childNodes[0].childNodes.length, 0);
      strictEqual(vTree.childNodes[1].nodeName, 'body');
      strictEqual(vTree.childNodes[1].childNodes.length, 1);
      strictEqual(vTree.childNodes[1].childNodes[0].nodeName, 'script');
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

      strictEqual(vTree.childNodes.length, 2);
      strictEqual(vTree.childNodes[0].nodeName, 'head');
      strictEqual(vTree.childNodes[0].childNodes.length, 2);
      strictEqual(vTree.childNodes[0].childNodes[0].nodeName, 'script');
      strictEqual(vTree.childNodes[0].childNodes[0].childNodes[0].nodeValue, 'test');
      strictEqual(vTree.childNodes[0].childNodes[1].childNodes[0].nodeValue, 'this');
      strictEqual(vTree.childNodes[1].nodeName, 'body');
      strictEqual(vTree.childNodes[1].childNodes.length, 1);
      strictEqual(vTree.childNodes[1].childNodes[0].nodeName, 'p');
    });

    it('will support brackets in attribute values', () => {
      const vTree = parse(`<a data-text="<>"></a>`).childNodes[0];

      strictEqual(vTree.nodeName, 'a');
      strictEqual(vTree.attributes['data-text'], '<>');
    });

    it('will support complex markup in attribute values', () => {
      const vTree = parse(`<a data-text="<li class='test'></li>"></a>`).childNodes[0];

      strictEqual(vTree.nodeName, 'a');
      strictEqual(vTree.attributes['data-text'], '<li class=\'test\'></li>');
    });

    it('will parse text siblings next to elements', () => {
      const vTrees = parse(`<div></div> Hello world`).childNodes;

      strictEqual(vTrees[0].nodeName, 'div');
      strictEqual(vTrees[1].nodeName, '#text');
      strictEqual(vTrees[1].nodeValue, ' Hello world');
    });

    it('will support parsing text before element', () => {
      const vTrees = parse(`Hello <div></div>`).childNodes;

      strictEqual(vTrees.length, 2);
      strictEqual(vTrees[0].nodeName, '#text');
      strictEqual(vTrees[0].nodeValue, 'Hello ');
      strictEqual(vTrees[1].nodeName, 'div');
    });

    it('will support parsing just text', () => {
      const vTrees = parse(`Hello`).childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, '#text');
      strictEqual(vTrees[0].nodeValue, 'Hello');
    });

    it('will parse out full token attributes', () => {
      const token = '__DIFFHTML_BABEL__';
      const vTrees = parse(`<input ${token}/>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'input');
      deepStrictEqual(vTrees[0].attributes, { [token]: token });
    });

    it('will parse out partial attributes', () => {
      const token = '__DIFFHTML__0__';
      const supplemental = {
        attributes: ['test'],
        tags: [],
        children: [],
      };
      const vTrees = parse(`<input value=${token}/>`, supplemental).childNodes;

      strictEqual(vTrees[0].nodeName, 'input');
      deepStrictEqual(vTrees[0].attributes, { value: 'test' });
    });

    it('will parse a key-only attribute', () => {
      const token = '__DIFFHTML__0__';
      const supplemental = {
        tags: [],
        attributes: ['disabled'],
        children: [],
      };
      const vTrees = parse(`<input ${token}/>`, supplemental).childNodes;

      strictEqual(vTrees[0].nodeName, 'input');
      deepStrictEqual(vTrees[0].attributes, { disabled: 'disabled' });
    });

    it('will support passing childNodes as an attribute', () => {
      const supplemental = createSupplemental({
        attributes: ['hello world']
      })
      const vTrees = parse(`<div childNodes=__DIFFHTML__0__ />`, supplemental).childNodes;

      deepStrictEqual(vTrees[0].childNodes, [createTree('#text', 'hello world')]);
    });

    it('will support passing childNodes as an attribute to pave over existing children', () => {
      const supplemental = createSupplemental({
        attributes: ['hello world']
      });
      const vTrees = parse(`<div childNodes=__DIFFHTML__0__>test</div>`, supplemental).childNodes;

      deepStrictEqual(vTrees[0].childNodes, [createTree('#text', 'hello world')]);
    });

    it('will ignore parsing doctypes', () => {
      const vTree = parse(`<!doctype html>`).childNodes[0];
      strictEqual(vTree, undefined);
    });

    it('will support mixed cased elements being self closed', () => {
      const vTrees = parse(`<CustomElement
        attr="test"
        /><div>Hello world</div>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'customelement');
      deepStrictEqual(vTrees[0].attributes, { attr: 'test' });
      strictEqual(vTrees[1].nodeName, 'div');
      strictEqual(vTrees[1].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[1].childNodes[0].nodeValue, 'Hello world');
    });

    it('will support passing custom self closing elements', () => {
      const vTrees = parse(`<div childNodes="test" />`, null, {
        parser: {
          strict: true,
          selfClosingElements: ['div'],
        }
      }).childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, 'div');
      strictEqual(vTrees[0].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[0].childNodes[0].nodeValue, 'test');
    });

    it('will support passing custom raw elements', () => {
      const vTrees = parse(`<div><p></p></div>`, null, {
        parser: {
          strict: true,
          rawElements: ['div'],
        }
      }).childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, 'div');
      strictEqual(vTrees[0].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[0].childNodes[0].nodeValue, '<p></p>');
    });

    it('will leave tokens in the children if no value is found', () => {
      const vTrees = parse('__DIFFHTML__0__', null).childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, '#text');
      strictEqual(vTrees[0].nodeValue, '__DIFFHTML__0__');
    });

    it('will leave tokens in the attributes if no value is found', () => {
      const vTrees = parse('<a href=__DIFFHTML__0__>test</a>', null).childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, 'a');
      deepStrictEqual(vTrees[0].attributes, { href: '__DIFFHTML__0__' });
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

      strictEqual(vTrees[0].nodeName, 'pre');
      strictEqual(vTrees[0].childNodes.length, 1);
      strictEqual(vTrees[0].childNodes[0].nodeName, 'code');
    });

    it('will support nested elements within <code>', () => {
      const vTrees = parse(`<code><pre></pre></code>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'code');
      strictEqual(vTrees[0].childNodes.length, 1);
      strictEqual(vTrees[0].childNodes[0].nodeName, 'pre');
    });

    it('will not support nested elements within <script>', () => {
      const vTrees = parse(`<script><pre></pre></script>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'script');
      strictEqual(vTrees[0].childNodes.length, 1);
      strictEqual(vTrees[0].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will not support nested elements within <noscript>', () => {
      const vTrees = parse(`<noscript><pre></pre></noscript>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'noscript');
      strictEqual(vTrees[0].childNodes.length, 1);
      strictEqual(vTrees[0].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will not support nested elements within <style>', () => {
      const vTrees = parse(`<style><pre></pre></style>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'style');
      strictEqual(vTrees[0].childNodes.length, 1);
      strictEqual(vTrees[0].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
    });

    it('will not support nested elements within <template>', () => {
      const vTrees = parse(`<template><pre></pre></template>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'template');
      strictEqual(vTrees[0].childNodes.length, 1);
      strictEqual(vTrees[0].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[0].childNodes[0].nodeValue, '<pre></pre>');
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

      strictEqual(vTrees.length, 7);
    });

    it('will support top-level interpolated string tag names', () => {
      const div = 'div';
      const supplemental = createSupplemental({ tags: [div] });
      const vTree = parse('<__DIFFHTML__0__ />', supplemental);

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

    it('will prepend a value into a single attribute', () => {
      const hello = 'hello';
      const world = 'world';
      const supplemental = createSupplemental({
        attributes: [hello],
      })
      const vTree = parse(`
        <div class="__DIFFHTML__0__ ui"></div>
      `.trim(), supplemental);

      deepStrictEqual(vTree, {
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
            class: 'hello ui',
          },
        }],
        attributes: {},
      });
    });

    it('will append a value into a single attribute', () => {
      const hello = 'hello';
      const world = 'world';
      const supplemental = createSupplemental({
        attributes: [hello],
      })
      const vTree = parse(`
        <div class="ui __DIFFHTML__0__"></div>
      `.trim(), supplemental);

      deepStrictEqual(vTree, {
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
            class: 'ui hello',
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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

      deepStrictEqual(vTree, {
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
    it('will fill the pool to the right size', () => {
      const defaultSize = Pool.size;

      strictEqual(Pool.memory.free.size, defaultSize);

      // Cut Pool size in half.
      Pool.size = floor(defaultSize / 2);
      Pool.fill();

      strictEqual(Pool.memory.free.size, Pool.size);

      // Increase to twice default;
      Pool.size = floor(defaultSize * 2);
      Pool.fill();

      strictEqual(Pool.memory.free.size, Pool.size);

      // Bring pool back to default size.
      Pool.size = defaultSize;
      Pool.fill();
    });

    it('will create additional shapes if the pool is exceeded', () => {
      let shape = null;

      for (let i = 0; i < Pool.size + 1; i++) {
        shape = createTree('div');
      }

      strictEqual(Pool.memory.free.size, 0);
      strictEqual(Pool.memory.allocated.size, Pool.size + 1);

      gc();

      strictEqual(Pool.memory.free.size, Pool.size + 1);
      strictEqual(Pool.memory.allocated.size, 0);

      Pool.memory.free.delete(shape);

      strictEqual(Pool.memory.free.size, Pool.size);
    });
  });

  describe('Memory', () => {
    it('will protect and unprotect a VTree through garbage collection', () => {
      const vTree = createTree('div');

      protectVTree(vTree);
      gc();

      strictEqual(Pool.memory.free.size, Pool.size - 1);
      strictEqual(Pool.memory.protected.size, 1);

      unprotectVTree(vTree);
      gc();

      strictEqual(Pool.memory.free.size, Pool.size);
      strictEqual(Pool.memory.protected.size, 0);
    });

    it('will protect and unprotect nested VTrees', () => {
      const vTree = createTree('div', null, createTree('span'));

      protectVTree(vTree);
      gc();

      strictEqual(Pool.memory.free.size, Pool.size - 2);
      strictEqual(Pool.memory.protected.size, 2);

      unprotectVTree(vTree);
      gc();

      strictEqual(Pool.memory.free.size, Pool.size);
      strictEqual(Pool.memory.protected.size, 0);
    });

    it('will "garbage collect" unprotected VTrees', () => {
      const vTree = createTree('div', null, createTree('span'));

      protectVTree(vTree);
      unprotectVTree(vTree.childNodes[0]);
      gc();

      strictEqual(Pool.memory.free.size, Pool.size - 1);
      strictEqual(Pool.memory.protected.size, 1);
      strictEqual(Pool.memory.free.has(vTree.childNodes[0]), true);

      unprotectVTree(vTree);
      gc();

      strictEqual(Pool.memory.free.size, Pool.size);
      strictEqual(Pool.memory.protected.size, 0);
    });

    it('will garbage collect DOM Node associations', () => {
      const domNode = document.createElement('div');
      const vTree = createTree(domNode);

      protectVTree(vTree);

      strictEqual(Pool.memory.free.size, Pool.size - 1);
      strictEqual(Pool.memory.protected.has(vTree), true);

      gc();

      strictEqual(Pool.memory.free.size, Pool.size - 1);
      strictEqual(Pool.memory.protected.has(vTree), true);

      unprotectVTree(vTree);
      gc();

      let cacheHasNode = false;

      NodeCache.forEach((/** @type {HTMLElement} */node) => {
        if (node === domNode) {
          cacheHasNode = true;
        }
      })

      strictEqual(cacheHasNode, false);
    });
  });

  describe('Performance', () => {
    it(`will return a NOP when the user doesn't have search`, () => {
      const mount = document.createElement('div');
      const input = createTree(mount);
      const measure = makeMeasure({ mount, input });

      strictEqual(measure.name, 'nop');
    });

    it(`will return a NOP when the user has search, but no diff`, () => {
      const mount = document.createElement('div');
      const input = createTree(mount);

      location.href = 'about:blank?';

      const measure = makeMeasure({ mount, input });
      strictEqual(measure.name, 'nop');
    });

    it('will return a real measure function if requested', () => {
      const mount = document.createElement('div');
      const input = createTree(mount);

      location.href = 'about:blank?diff_collectmetrics';

      const measure = makeMeasure({ mount, input });

      strictEqual(measure.name, '');
      strictEqual(measure.length, 1);
    });

    it('will use performance.mark on the first call', () => {
      const mount = document.createElement('div');
      const input = createTree(mount);

      location.href = 'about:blank?diff_collectmetrics';

      const measure = makeMeasure({ mount, input });

      measure('test-1');

      strictEqual(performance.mark.calledOnce, true);
      ok(performance.mark.firstCall.args[0].match(/\[\d+\] test-1/));
    });

    it('will use performance.measure on the second call', () => {
      const mount = document.createElement('div');
      const input = createTree(mount);

      location.href = 'about:blank?diff_collectmetrics';

      const measure = makeMeasure({ mount, input });

      measure('test-2');
      measure('test-2');

      strictEqual(performance.measure.callCount, 1);
      ok(performance.mark.firstCall.args[0].match(/\[\d+\] test-2/));
      ok(performance.mark.lastCall.args[0].match(/\[\d+\] test-2-end/));

      const regex = /diffHTML \[\d+\] test-2 \((.*)ms\)/;
      ok(regex.exec(performance.measure.firstCall.args[0]));
    });

    it('will log out web component names', () => {
      const mount = document.createElement('div');
      /** @type {any} */ (mount).host = { constructor: { name: 'Component' } };
      const input = createTree(mount);

      location.href = 'about:blank?diff_collectmetrics';

      const measure = makeMeasure({ mount, input });

      measure('test-3');
      measure('test-3');

      strictEqual(performance.measure.callCount, 1);

      const regex = /diffHTML Component \[\d+\] test-3 \((.*)ms\)/;
      ok(regex.exec(performance.measure.firstCall.args[0]));
    });

    it('will log out tagName component names', () => {
      class Component {}
      const mount = document.createElement('div');
      const input = createTree(Component);

      location.href = 'about:blank?diff_collectmetrics';

      const measure = makeMeasure({ mount, input });

      measure('test-4');
      measure('test-4');

      strictEqual(performance.measure.callCount, 1);

      const regex = /diffHTML Component \[\d+\] test-4 \((.*)ms\)/;
      ok(regex.exec(performance.measure.firstCall.args[0]));
    });
  });

  describe('Process', () => {
    it('it matches the global process', () => {
      strictEqual(_process, global.process);
    });
  });
});
