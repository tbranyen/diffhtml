// @ts-nocheck
import { ok, notEqual, strictEqual, deepStrictEqual, throws, doesNotThrow, deepEqual } from 'assert';
import * as Sinon from 'sinon';
import createTree from '../lib/tree/create';
import { NodeCache } from '../lib/util/types';
import decodeEntities from '../lib/util/decode-entities';
import escape from '../lib/util/escape';
import parse, { openComment, closeComment, openTag, closeTag, attribute, text } from '../lib/util/parse';
import _process from '../lib/util/process';
import { protectVTree, unprotectVTree, gc } from '../lib/util/memory';
import makeMeasure from '../lib/util/make-measure';
import Pool from '../lib/util/pool';
import getConfig from '../lib/util/config';
import validateMemory from './util/validate-memory';
import createSupplemental from './util/create-supplemental';

const { it, describe } = globalThis;

// To appease nodejs
const { spy } = Sinon.default;

const { floor } = Math;
const { stringify } = JSON;

describe('Util', () => {
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

  describe('Parser regex', () => {
    beforeEach(() => {
      openComment.lastIndex = 0;
      closeComment.lastIndex = 0;
      openTag.lastIndex = 0;
      closeTag.lastIndex = 0;
      attribute.lastIndex = 0;
      text.lastIndex = 0;
    });

    it('will parse openComment match', () => {
      const input = '<!--';
      const output = openComment.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will set openComment index to non-0 when leading with whitespace', () => {
      const input = ' <!--';
      const output = openComment.exec(input);

      notEqual(output.index, 0);
    });

    it('will set openComment result to null when no match is found', () => {
      const input = 'test';
      const output = openComment.exec(input);

      strictEqual(output, null);
    });

    it('will parse closeComment match', () => {
      const input = '-->';
      const output = closeComment.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will set closeComment index to non-0 when leading with whitespace', () => {
      const input = ' -->';
      const output = closeComment.exec(input);

      notEqual(output.index, 0);
    });

    it('will set closeComment result to null when no match is found', () => {
      const input = 'test';
      const output = closeComment.exec(input);

      strictEqual(output, null);
    });

    it('will match openTag div', () => {
      const input = '<div';
      const output = openTag.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match openTag with custom element', () => {
      const input = '<custom-element';
      const output = openTag.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match openTag with custom token', () => {
      const input = '<__DIFFHTML_TOKEN_1__';
      const output = openTag.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match self closeTag', () => {
      const input = '/>';
      const output = closeTag.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match closeTag div', () => {
      const input = '</div>';
      const output = closeTag.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match closeTag custom element', () => {
      const input = '</custom-element>';
      const output = closeTag.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match closeTag custom token', () => {
      const input = '</__DIFFHTML_TOKEN_1__>';
      const output = closeTag.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match attribute with self closing no space', () => {
      const input = 'attr=value/>';
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr=value');
      strictEqual(output.index, 0);
    });

    it('will match attribute with self closing with space', () => {
      const input = 'attr=value />';
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr=value');
      strictEqual(output.index, 0);
    });

    it('will match attribute with close', () => {
      const input = 'attr=value>';
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr=value');
      strictEqual(output.index, 0);
    });

    it('will match attribute with close across new lines', () => {
      const input = `attr=value
      >`;
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr=value');
      strictEqual(output.index, 0);
    });

    it('will match simple attribute without quotes', () => {
      const input = 'attr=value>';
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr=value');
      strictEqual(output.index, 0);
    });

    it('will match attribute with key only', () => {
      const input = 'attr>';
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr');
      strictEqual(output.index, 0);
    });

    it('will match attribute with custom token key', () => {
      const input = '__DIFFHTML_TOKEN_1__>';
      const output = attribute.exec(input);

      strictEqual(output[0], '__DIFFHTML_TOKEN_1__');
      strictEqual(output.index, 0);
    });

    it('will match attribute with custom token key and value', () => {
      const input = '__DIFFHTML_TOKEN_1__=__DIFFHTML_TOKEN_2__>';
      const output = attribute.exec(input);

      strictEqual(output[0], '__DIFFHTML_TOKEN_1__=__DIFFHTML_TOKEN_2__');
      strictEqual(output.index, 0);
    });

    it('will match attribute with quotes', () => {
      const input = 'attr="value">';
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr="value"');
      strictEqual(output.index, 0);
    });

    it('will match attribute with markup in value', () => {
      const input = 'attr="<test>value</test>"';
      const output = attribute.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match attribute with quotes in value', () => {
      const input = 'attr="<test>"value"</test>"';
      const output = attribute.exec(input);

      strictEqual(output[0], 'attr="<test>"');
      strictEqual(output.index, 0);
    });

    it('will match attribute with quotes in value part 2', () => {
      const input = 'value"</test>"';
      const output = attribute.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match attribute with special symbols in key and value', () => {
      const input = '@test=@value>';
      const output = attribute.exec(input);

      strictEqual(output[0], '@test=@value');
      strictEqual(output.index, 0);
    });

    it('will match attribute value with forward slash in quotes', () => {
      const input = 'test="/"';
      const output = attribute.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match attribute value with forward slash without quotes', () => {
      const input = 'test=/>';
      const output = attribute.exec(input);

      strictEqual(output[0], 'test=');
      strictEqual(output.index, 0);
    });

    it('will match attribute value with url without quotes', () => {
      const input = 'test=https://google.com>';
      const output = attribute.exec(input);

      strictEqual(output[0], 'test=https://google.com');
      strictEqual(output.index, 0);
    });

    it('will match attribute with forward slash directly after token', () => {
      const input = 'test=__DIFFHTML_TOKEN_1__/>';
      const output = attribute.exec(input);

      strictEqual(output[0], 'test=__DIFFHTML_TOKEN_1__');
      strictEqual(output.index, 0);
    });

    it('will match text', () => {
      const input = 'Hello world';
      const output = text.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });

    it('will match text with entity tags', () => {
      const input = 'Hello world&gt;';
      const output = text.exec(input);

      strictEqual(output[0], 'Hello world&gt;');
      strictEqual(output.index, 0);
    });

    it('will match text with emoji', () => {
      const input = 'Hello world 😊';
      const output = text.exec(input);

      strictEqual(output[0], 'Hello world 😊');
      strictEqual(output.index, 0);
    });

    it('will match text across multiple lines', () => {
      const input = `
        Hello world
      `;
      const output = text.exec(input);

      strictEqual(output[0], input);
      strictEqual(output.index, 0);
    });
  });

  describe('Parse', () => {
    // Comments
    // Text
    // Doc types
    // Elements

    it('will parse a comment', () => {
      const vTree = parse('<!-- This is a comment -->');

      strictEqual(vTree.childNodes[0].nodeName, '#comment');
      strictEqual(vTree.childNodes[0].nodeValue.trim(), 'This is a comment');
    });

    it('will parse a comment with html in it', () => {
      const className = 'test';
      const vTree = parse(`
        <!--
        <input
          class=${className}
        />
        -->
      `);

      strictEqual(vTree.childNodes[1].nodeName, '#comment');
      strictEqual(vTree.childNodes[1].nodeValue.trim(), '<input\n          class=test\n        />');
    });

    it('will parse a multi-line comment', () => {
      const vTree = parse(`<!--
          This is a comment
      -->`);

      strictEqual(vTree.childNodes[0].nodeName, '#comment');
      strictEqual(vTree.childNodes[0].nodeValue.trim(), 'This is a comment');
    });

    it('will parse multiple comments', () => {
      const vTree = parse('<!-- Comment 1 --><!-- Comment 2 -->');

      strictEqual(vTree.childNodes[0].nodeName, '#comment');
      strictEqual(vTree.childNodes[0].nodeValue.trim(), 'Comment 1');

      strictEqual(vTree.childNodes[1].nodeName, '#comment');
      strictEqual(vTree.childNodes[1].nodeValue.trim(), 'Comment 2');
    });

    it('will parse comment without closing tag', () => {
      const vTree = parse('<!-- Comment 1 ');

      strictEqual(vTree.childNodes[0].nodeName, '#comment');
      strictEqual(vTree.childNodes[0].nodeValue.trim(), 'Comment 1');
    });

    it('will parse comment with html markup', () => {
      const vTree = parse('<!-- <div></div> -->');

      strictEqual(vTree.childNodes[0].nodeName, '#comment');
      strictEqual(vTree.childNodes[0].nodeValue.trim(), '<div></div>');
    });

    it('will parse text', () => {
      const vTree = parse('This is text');

      strictEqual(vTree.childNodes[0].nodeName, '#text');
      strictEqual(vTree.childNodes[0].nodeValue, 'This is text');
    });

    it('will parse multi-line text', () => {
      const vTree = parse(`
        This is text
      `);

      strictEqual(vTree.childNodes[0].nodeName, '#text');
      strictEqual(vTree.childNodes[0].nodeValue.trim(), 'This is text');
    });

    it('will ignore doctypes', () => {
      const vTree = parse('<!doctype html>').childNodes[0];
      strictEqual(vTree, undefined);
    });

    it('will parse text after an element', () => {
      const vTrees = parse(`<div></div> Hello world`).childNodes;

      strictEqual(vTrees[0].nodeName, 'div');
      strictEqual(vTrees[1].nodeName, '#text');
      strictEqual(vTrees[1].nodeValue, ' Hello world');
    });

    it('will parse text before an element', () => {
      const vTrees = parse(`Hello <div></div>`).childNodes;

      strictEqual(vTrees.length, 2);
      strictEqual(vTrees[0].nodeName, '#text');
      strictEqual(vTrees[0].nodeValue, 'Hello ');
      strictEqual(vTrees[1].nodeName, 'div');
    });

    it('will parse invalid markup as text', () => {
      const vTrees = parse(`
      <>"']/;
      test
      `).childNodes;

      strictEqual(vTrees[1].nodeValue, `<>"']/;\n      test\n      `);
    });

    it('will parse an open tag', () => {
      const vTree = parse('<div>');

      strictEqual(vTree.childNodes[0].nodeName, 'div');
    });

    it('will support single line parsing with nested element', () => {
      const vTree = parse('<a href="#"><img src="#"></a>').childNodes[0];

      strictEqual(vTree.nodeName, 'a');
      strictEqual(vTree.attributes.href, '#');
      strictEqual(vTree.childNodes[0].nodeName, 'img');
      strictEqual(vTree.childNodes[0].attributes.src, '#');
    });

    it('will support boolean attributes', () => {
      const vTree = parse('<option value="test" selected></option>').childNodes[0];

      strictEqual(vTree.attributes.value, 'test');
      strictEqual(vTree.attributes.selected, true);
    });

    it('will parse links without quotes', () => {
      const vTree = parse('<a href=http://google.com>Google</a>').childNodes[0];
      strictEqual(vTree.attributes.href, 'http://google.com');
    });

    it('will support quote-less values', () => {
      const vTree = parse('<option value=test></option>').childNodes[0];
      strictEqual(vTree.attributes.value, 'test');
    });

    it('will not parse whitespace from inside <html></html> tags', () => {
      const vTree = parse('<html>\n</html>').childNodes[0];
      strictEqual(vTree.childNodes.length, 2); // head & body
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

    it('will properly separate elements on a single line', () => {
      const { childNodes } = parse(`<div attr="1" /><p attr="2">test</p>`);

      strictEqual(childNodes.length, 2);
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

    it('will parse out full token attributes', () => {
      const token = '__DIFFHTML_BABEL__';
      const vTrees = parse(`<input ${token}/>`).childNodes;

      strictEqual(vTrees[0].nodeName, 'input');
      deepStrictEqual(vTrees[0].attributes, { [token]: true });
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

    it('will support closing a self closed element', () => {
      const vTrees = parse(`
          <meta id="test"></meta><div>test</div>
      `).childNodes;

      strictEqual(vTrees[1].nodeName, 'meta');
      strictEqual(vTrees[2].nodeName, 'div');
    });

    it('will support passing custom self closing elements', () => {
      const vTrees = parse(`<div childNodes="test" />`, {
        parser: {
          selfClosingElements: ['div'],
        }
      }).childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, 'div');
      strictEqual(vTrees[0].attributes.childNodes, 'test');
    });

    it('will support passing custom raw elements', () => {
      const vTrees = parse(`<div><p></p></div>`, {
        parser: {
          rawElements: ['div'],
        }
      }).childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, 'div');
      strictEqual(vTrees[0].childNodes[0].nodeName, '#text');
      strictEqual(vTrees[0].childNodes[0].nodeValue, '<p></p>');
    });

    it('will leave tokens in the children if no value is found', () => {
      const vTrees = parse('__DIFFHTML__0__').childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, '#text');
      strictEqual(vTrees[0].nodeValue, '__DIFFHTML__0__');
    });

    it('will leave tokens in the attributes if no value is found', () => {
      const vTrees = parse('<a href=__DIFFHTML__0__>test</a>').childNodes;

      strictEqual(vTrees.length, 1);
      strictEqual(vTrees[0].nodeName, 'a');
      deepStrictEqual(vTrees[0].attributes, { href: '__DIFFHTML__0__' });
    });

    it('will not throw on invalid markup', () => {
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
        `).childNodes[0];
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

    describe('Tag omission', () => {
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

      it('will support end tag omission for LI elements', () => {
        const vTree = parse(`
          <li>Hello
          <li>World
        `.trim());

        deepStrictEqual(vTree, createTree([
          createTree('li', null, createTree('#text', 'Hello\n          ')),
          createTree('li', null, createTree('#text', 'World')),
        ]));
      });

      it('will support end tag omission for DT elements', () => {
        const vTreeWithDT = parse(`
          <dt>Hello
          <dt>World
        `.trim());

        deepStrictEqual(vTreeWithDT, createTree([
          createTree('dt', null, createTree('#text', 'Hello\n          ')),
          createTree('dt', null, createTree('#text', 'World')),
        ]));

        const vTreeWithDD = parse(`
          <dt>Hello
          <dd>World
        `.trim());

        deepStrictEqual(vTreeWithDD, createTree([
          createTree('dt', null, createTree('#text', 'Hello\n          ')),
          createTree('dd', null, createTree('#text', 'World')),
        ]));
      });

      it('will support end tag omission for DD elements', () => {
        const vTreeWithDD = parse(`
          <dd>Hello
          <dd>World
        `.trim());

        deepStrictEqual(vTreeWithDD, createTree([
          createTree('dd', null, createTree('#text', 'Hello\n          ')),
          createTree('dd', null, createTree('#text', 'World')),
        ]));

        const vTreeWithDT = parse(`
          <dd>Hello
          <dt>World
        `.trim());

        deepStrictEqual(vTreeWithDT, createTree([
          createTree('dd', null, createTree('#text', 'Hello\n          ')),
          createTree('dt', null, createTree('#text', 'World')),
        ]));
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

    it('will support self closing elements', () => {
      const vTree = parse(`
        <base url="http://diffhtml.com">
        <meta name="test">
      `);

      strictEqual(vTree.childNodes[1].nodeName, 'base');
      strictEqual(vTree.childNodes[3].nodeName, 'meta');
    });

    it('will support closing void elements', () => {
      const vTree = parse(`
        <head>
          <meta name="test"></meta>
          <meta name="test2"></meta>
        </head>
      `);

      strictEqual(vTree.childNodes[1].nodeName, 'head');
      strictEqual(vTree.childNodes[1].childNodes[1].nodeName, 'meta');
      strictEqual(vTree.childNodes[1].childNodes[1].attributes.name, 'test');
      strictEqual(vTree.childNodes[1].childNodes[3].nodeName, 'meta');
      strictEqual(vTree.childNodes[1].childNodes[3].attributes.name, 'test2');
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

    it('will support nesting elements without self close', () => {
      const vTree = parse(`
        <div><p></p><div></div></div>
      `.trim());

      strictEqual(vTree.childNodes[0].nodeName, 'div');
      strictEqual(vTree.childNodes[0].childNodes[0].nodeName, 'p');
      strictEqual(vTree.childNodes[0].childNodes[1].nodeName, 'div');
    });

    it('will separate dynamic attribute values', () => {
      const vTree = parse(`
        <input
          type="checkbox"
          value=__DIFFHTML_0__
          __DIFFHTML_1__
        />
      `);

      strictEqual(vTree.childNodes[1].attributes.value, '__DIFFHTML_0__');
      strictEqual(vTree.childNodes[1].attributes.__DIFFHTML_1__, true);
    });

    it('will separate dynamic key from value', () => {
      const vTree = parse(`
        <input __DIFFHTML_0__ class=__DIFFHTML_1__ />
      `);

      strictEqual(vTree.childNodes[1].attributes['__DIFFHTML_0__'], true);
      strictEqual(vTree.childNodes[1].attributes.class, '__DIFFHTML_1__');
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

      strictEqual(measure.name, 'FUN');
    });

    it(`will return a NOP when the user has search, but no diff`, () => {
      const mount = document.createElement('div');
      const input = createTree(mount);

      location.href = 'about:blank?';

      const measure = makeMeasure({ mount, input });
      strictEqual(measure.name, 'FUN');
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
