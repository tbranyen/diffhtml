import * as parser from '../../../lib/util/parser';
import { cleanMemory } from '../../../lib/util/memory';
import validateMemory from '../../util/validateMemory';
import { innerHTML, release } from '../../../lib/index';

describe('Unit: Parser', function() {
  afterEach(function() {
    cleanMemory();
    validateMemory();
  });

  it('supports empty attributes', function() {
    var node = parser.parse('<option value="test" selected></option>').childNodes[0];

    assert.equal(node.attributes[0].name, 'value');
    assert.equal(node.attributes[0].value, 'test');
    assert.equal(node.attributes[1].name, 'selected');
  });

  it('supports quote-less values', function() {
    var node = parser.parse('<option value=test></option>').childNodes[0];

    assert.equal(node.attributes[0].name, 'value');
    assert.equal(node.attributes[0].value, 'test');
  });

  it('does not parse whitespace from inside <html></html> tags', function() {
    var node = parser.parse('<html>\n</html>').childNodes[0];

    assert.equal(node.childNodes.length, 2);
  });

  it('will move elements found between the ends of body and html', function() {
    var node = parser.parse(`
      <html>
        <body></body>
        <script></script>
      </html>
    `).childNodes[0];

    assert.equal(node.childNodes.length, 2);
    assert.equal(node.childNodes[0].nodeName, 'head');
    assert.equal(node.childNodes[0].childNodes.length, 0);
    assert.equal(node.childNodes[1].nodeName, 'body');
    assert.equal(node.childNodes[1].childNodes.length, 1);
    assert.equal(node.childNodes[1].childNodes[0].nodeName, 'script');
  });

  it('will move elements found before or after head and before body', function() {
    var node = parser.parse(`
      <html>
        <script>test</script>
        <head></head>
        <script>this</script>
        <body></body>
        <p></p>
      </html>
    `).childNodes[0];

    assert.equal(node.childNodes.length, 2);
    assert.equal(node.childNodes[0].nodeName, 'head');
    assert.equal(node.childNodes[0].childNodes.length, 2);
    assert.equal(node.childNodes[0].childNodes[0].nodeName, 'script');
    assert.equal(node.childNodes[0].childNodes[0].childNodes[0].nodeValue, 'test');
    assert.equal(node.childNodes[0].childNodes[1].childNodes[0].nodeValue, 'this');
    assert.equal(node.childNodes[1].nodeName, 'body');
    assert.equal(node.childNodes[1].childNodes.length, 1);
    assert.equal(node.childNodes[1].childNodes[0].nodeName, 'p');
  });

  it('cannot support brackets in attribute values', function() {
    var node = parser.parse(`<a data-text="<li class='test'></li>"></a>`).childNodes[0];

    assert.equal(node.nodeName, 'a');
    assert.equal(node.attributes[0].name, 'data-text');
    assert.equal(node.attributes[0].value,  '\"<li');
  });

  it('can parse text siblings next to elements', function() {
    var nodes = parser.parse(`<div></div> Hello world`).childNodes;

    assert.equal(nodes[0].nodeName, 'div');
    assert.equal(nodes[1].nodeName, '#text');
    assert.equal(nodes[1].nodeValue, 'Hello world');
  });

  it('supports parsing text before element', function() {
    var nodes = parser.parse(`Hello <div></div>`).childNodes;

    assert.equal(nodes.length, 2);
    assert.equal(nodes[0].nodeName, '#text');
    assert.equal(nodes[0].nodeValue, 'Hello ');
    assert.equal(nodes[1].nodeName, 'div');
  });

  it('can parse out full token attributes', function() {
    var token = '__DIFFHTML_BABEL__';
    var nodes = parser.parse(`<input ${token}/>`).childNodes;

    assert.equal(nodes[0].nodeName, 'input');
    assert.deepEqual(nodes[0].attributes, [{ name: token, value: token }]);
  });

  it('will ignore parsing doctypes', function() {
    var nodes = parser.parse(`<!doctype html>`).childNodes[0];
    assert.equal(nodes, undefined);
  });

  it('supports mixed cased elements being self closed', function() {
    var nodes = parser.parse(`<CustomElement
      attr="test"
      /><div>Hello world</div>`).childNodes;

    assert.equal(nodes[0].nodeName, 'customelement');
    assert.deepEqual(nodes[0].attributes[0], { name: 'attr', value: 'test' });
    assert.equal(nodes[1].nodeName, 'div');
    assert.equal(nodes[1].childNodes[0].nodeName, '#text');
    assert.equal(nodes[1].childNodes[0].nodeValue, 'Hello world');
  });

  it('will throw on invalid markup, when in strict mode', function() {
    assert.throws(e => {
      parser.parse(`
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

      assert.equal(ex.message,
        "</p>\n^\nPossibly invalid markup. Saw p, expected li...\n        \n      </ul>\n      <div></div>"
      );
    });
  });

  it('will not throw on invalid markup when strict mode is false', function() {
    assert.doesNotThrow(() => {
      parser.parse(`
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

  it('supports nested elements within <pre>', function() {
    var nodes = parser.parse(`<pre><code></code></pre>`).childNodes;

    assert.equal(nodes[0].nodeName, 'pre');
    assert.equal(nodes[0].childNodes.length, 1);
    assert.equal(nodes[0].childNodes[0].nodeName, 'code');
  });

  it('does not support nested elements within <script>', function() {
    var nodes = parser.parse(`<script><pre></pre></script>`).childNodes;

    assert.equal(nodes[0].nodeName, 'script');
    assert.equal(nodes[0].childNodes.length, 1);
    assert.equal(nodes[0].childNodes[0].nodeName, '#text');
    assert.equal(nodes[0].childNodes[0].nodeValue, '<pre></pre>');
  });

  it('does not support nested elements within <noscript>', function() {
    var nodes = parser.parse(`<noscript><pre></pre></noscript>`).childNodes;

    assert.equal(nodes[0].nodeName, 'noscript');
    assert.equal(nodes[0].childNodes.length, 1);
    assert.equal(nodes[0].childNodes[0].nodeName, '#text');
    assert.equal(nodes[0].childNodes[0].nodeValue, '<pre></pre>');
  });

  it('does not support nested elements within <style>', function() {
    var nodes = parser.parse(`<style><pre></pre></style>`).childNodes;

    assert.equal(nodes[0].nodeName, 'style');
    assert.equal(nodes[0].childNodes.length, 1);
    assert.equal(nodes[0].childNodes[0].nodeName, '#text');
    assert.equal(nodes[0].childNodes[0].nodeValue, '<pre></pre>');
  });

  it('does not support nested elements within <code>', function() {
    var nodes = parser.parse(`<code><pre></pre></code>`).childNodes;

    assert.equal(nodes[0].nodeName, 'code');
    assert.equal(nodes[0].childNodes.length, 1);
    assert.equal(nodes[0].childNodes[0].nodeName, '#text');
    assert.equal(nodes[0].childNodes[0].nodeValue, '<pre></pre>');
  });

  it('does not support nested elements within <template>', function() {
    var nodes = parser.parse(`<template><pre></pre></template>`).childNodes;

    assert.equal(nodes[0].nodeName, 'template');
    assert.equal(nodes[0].childNodes.length, 1);
    assert.equal(nodes[0].childNodes[0].nodeName, '#text');
    assert.equal(nodes[0].childNodes[0].nodeValue, '<pre></pre>');
  });

  it('supports self closing elements', function() {
    var nodes = parser.parse(`
      <meta/>
      <img/>
      <link/>
      <input/>
      <area/>
      <br/>
      <hr/>
    `.trim()).childNodes.filter(el => el.nodeType === 1);

    assert.equal(nodes.length, 7);
  });
});
