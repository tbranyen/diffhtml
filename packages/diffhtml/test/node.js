import { ok, equal, throws } from 'assert';
import createNode from '../lib/node/create';
import patchNode from '../lib/node/patch';
import { PATCH_TYPE } from '../lib/util/types';
import html from '../lib/html';
import validateMemory from './util/validate-memory';
import release from '../lib/release';
import createTree from '../lib/tree/create';
import { addTransitionState, removeTransitionState } from '../lib/transition';

const { defineProperty } = Object;

describe('Node', function() {
  afterEach(() => {
    ['attached', 'detached', 'replaced', 'textChanged', 'attributeChanged']
      .forEach(transitionName => removeTransitionState(transitionName));

    validateMemory();
  });

  describe('create', () => {
    it('will throw an error if called without a VTree', () => {
      /** @type {any} */
      const invalidCreateNode = createNode;
      const expectedException = /Missing VTree when trying to create DOM Node/;

      throws(() => invalidCreateNode(), expectedException);
      throws(() => invalidCreateNode(null), expectedException);
      throws(() => invalidCreateNode(undefined), expectedException);
      throws(() => invalidCreateNode(false), expectedException);
      throws(() => invalidCreateNode(''), expectedException);
    });

    it('will create a DOM Node from a VTree', () => {
      const domNode = createNode(
        createTree('div', [
          createTree('#text', 'test'),
        ])
      );

      ok(domNode instanceof Element);
      equal(domNode.textContent, 'test');

      release(domNode);
    });

    it('will create a DOM Node from a VTree-like object', () => {
      const domNode = createNode({
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      });

      ok(domNode instanceof Element);
      equal(domNode.textContent, 'test');
    });

    it('will get a DOM Node from existing vTree', () => {
      const descriptor = {
        nodeName: 'div',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'test'
        }]
      };

      createNode(descriptor);

      const retVal = createNode(descriptor);

      ok(retVal instanceof Element);
      equal(retVal.textContent, 'test');
    });

    it('will create an empty DOM Node', () => {
      const domNode = createNode({
        nodeName: 'p'
      });

      equal(domNode.childNodes.length, 0);
      equal(domNode.attributes.length, 0);
      equal(domNode.nodeName, 'P');
    });

    it('will set text content', () => {
      const domNode = createNode({
        nodeName: 'p',
        childNodes: [{
          nodeName: '#text',
          nodeValue: 'hello'
        }]
      });

      equal(domNode.nodeName, 'P');
      equal(domNode.textContent, 'hello');
    });

    it('will create a DOM Node with children', () => {
      const domNode = createNode({
        nodeName: 'div',
        childNodes: [{
          nodeName: 'p',
          childNodes: [{
            nodeName: '#text',
            nodeValue: 'hello'
          }]
        }]
      });

      equal(domNode.childNodes[0].nodeName, 'P');
      equal(domNode.childNodes[0].textContent, 'hello');
    });

    it('will not set attributes, they are applied during patch', () => {
      const domNode = createNode({
        nodeName: 'div',
        attributes: { class: 'some_Value' },
      });

      equal(domNode.getAttribute('class'), null);
    });

    it('will create document fragments', () => {
      const domNode = createNode({
        nodeName: '#document-fragment',
        childNodes: [{ nodeName: '#text', nodeValue: 'test' }],
      });

      equal(domNode.nodeName, '#document-fragment');
      equal(domNode.childNodes[0].nodeName, '#text');
      equal(domNode.childNodes[0].nodeValue, 'test');
    });
  });

  describe('patch', () => {
    it('will set string properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);
      const patches = [PATCH_TYPE.SET_ATTRIBUTE, vTree, 'id', 'main'];

      patchNode(patches);
      release(domNode);

      equal(domNode.id, 'main');
      equal(domNode.getAttribute('id'), 'main');
    });

    it('will set boolean properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'isContentEditable',
        true,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.isContentEditable, true);
    });

    it('will set number properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'length',
        0,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.length, 0);
    });

    it('will set symbol properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'sym',
        Symbol.for('test'),
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.sym, Symbol.for('test'));
    });

    it('will set object properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);
      const obj = {};

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'obj',
        obj,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.obj, obj);
      equal(domNode.getAttribute('obj'), null);
    });

    it('will set function properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);
      const func = () => {};

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'func',
        func,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.func, func);
      equal(domNode.getAttribute('func'), null);
    });

    it('will set null properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'test',
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.test, null);
    });

    it('will set undefined properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'test',
        undefined,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.test, undefined);
    });

    it('will set known good dynamic properties', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);
      const func1 = () => {};
      const func2 = () => {};

      patchNode([
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'test',
        func1,
      ]);

      patchNode([
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'test',
        func2,
      ]);

      release(domNode);

      equal(domNode.test, func2);
    });

    it('will set invalid dynamic properties without erroring', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);
      const func = () => {};

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'nodeName',
        func,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.nodeName.toLowerCase(), 'div');
      equal(domNode.getAttribute('nodeName'), undefined);
    });

    it('will set invalid properties without erroring', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'nodeName',
        'span',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.nodeName.toLowerCase(), 'div');
      equal(domNode.getAttribute('nodeName'), 'span');
    });

    it('will set invalid null properties without erroring', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'nodeName',
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.nodeName.toLowerCase(), 'div');
      equal(domNode.getAttribute('nodeName'), '');
    });

    it('will set invalid undefined properties without erroring', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'nodeName',
        undefined,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.nodeName.toLowerCase(), 'div');
      equal(domNode.getAttribute('nodeName'), '');
    });

    it('will set event names as lowercase', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);
      const onClick = () => {};

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'onClick',
        onClick,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.onclick, onClick);
    });

    it('will set properties like autofocus without overriding', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'autofocus',
        true,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.autofocus, true);
    });

    it('will set style properties from an object', () => {
      const styles = { fontWeight: 'bold' };
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'style',
        styles,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.style.fontWeight, 'bold');
    });

    it('will unset checked=checked when removed', () => {
      const vTree = html`<input />`;
      const domNode = /** @type {HTMLInputElement} */ (createNode(vTree));

      patchNode([
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'checked',
        'checked',
      ]);

      patchNode([
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'checked',
      ]);

      equal(domNode.checked, false);
      equal(domNode.hasAttribute('checked'), false);
      release(domNode);
    });

    it('will unset checked=true when removed', () => {
      const vTree = html`<input />`;
      const domNode = /** @type {HTMLInputElement} */ (createNode(vTree));

      patchNode([
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'checked',
        true,
      ]);

      patchNode([
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'checked',
      ]);

      equal(domNode.checked, false);
      equal(domNode.hasAttribute('checked'), false);
      release(domNode);
    });

    it('will set checked=checked as true', () => {
      const vTree = html`<input />`;
      const domNode = /** @type {HTMLInputElement} */ (createNode(vTree));

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'checked',
        'checked',
      ];

      patchNode(patches);

      equal(domNode.checked, true);
      release(domNode);
    });

    it('will set checked=true as true', () => {
      const vTree = html`<input />`;
      const domNode = /** @type {HTMLInputElement} */ (createNode(vTree));

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'checked',
        true,
      ];

      patchNode(patches);

      equal(domNode.checked, true);
      release(domNode);
    });

    it('will set class as className', () => {
      const nested = html`<span></span>`;
      const vTree = html`<div>${nested}</div>`;
      const domNode = /** @type {HTMLElement} */ (createNode(vTree));

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        nested,
        'class',
        'some-class',
      ];

      patchNode(patches);

      equal(domNode.querySelector('.some-class'), createNode(nested));

      release(domNode);
    });

    it('will set attributes with no string values', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'autofocus',
        '',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.autofocus, '');
    });

    it('will set data attributes', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'data-test',
        'here',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.dataset.test, 'here');
    });

    it('will set attribute after promise resolution', async () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.SET_ATTRIBUTE,
        vTree,
        'id',
        'test',
      ];

      const promise = Promise.resolve();

      addTransitionState('attributeChanged', () => promise);
      const promises = patchNode(patches);

      equal(domNode.outerHTML, '<div></div>');

      await Promise.all(promises);

      release(domNode);

      equal(promises[0], promise);
      equal(domNode.outerHTML, '<div id="test"></div>');
    });

    it('will remove data attributes', () => {
      const vTree = html`<div data-test="true" />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'data-test',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.dataset.test, undefined);
      equal(domNode.getAttribute('data-test'), undefined);
    });

    it('will remove non-existent attribute', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'someprop',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.hasAttribute('someprop'), false);
      equal(domNode.someprop, undefined);
    });

    it('will remove existing attribute', () => {
      const vTree = html`<div someprop="test" />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'someprop',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.hasAttribute('someprop'), false);
      equal(domNode.someprop, undefined);
    });

    it('will remove existing property', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      domNode.someprop = 'test';

      const patches = [
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'someprop',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.hasAttribute('someprop'), false);
      equal(domNode.someprop, undefined);
    });

    it('will remove invalid properties without erroring', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      defineProperty(domNode, 'error', {
        get() { return true; },
        set() { throw null; },
      });

      const patches = [
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'error',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.error, true);
      equal(domNode.getAttribute('error'), undefined);
    });

    it('will remove known invalid properties without erroring', () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);

      defineProperty(domNode, 'error', {
        get() { return true; },
        set() { throw null; },
      });

      patchNode([
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'error',
      ]);

      patchNode([
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'error',
      ]);

      release(domNode);

      equal(domNode.error, true);
      equal(domNode.getAttribute('error'), undefined);
    });

    it('will remove attribute after promise resolution', async () => {
      const vTree = html`<div />`;
      const domNode = createNode(vTree);
      domNode.setAttribute('id', 'test');

      const patches = [
        PATCH_TYPE.REMOVE_ATTRIBUTE,
        vTree,
        'id',
      ];

      const promise = Promise.resolve();

      addTransitionState('attributeChanged', () => promise);
      const promises = patchNode(patches);

      equal(domNode.outerHTML, '<div id="test"></div>');

      await Promise.all(promises);

      release(domNode);

      equal(promises[0], promise);
      equal(domNode.outerHTML, '<div></div>');
    });

    it('will set value for empty text node', () => {
      const vTree = html``;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.NODE_VALUE,
        vTree,
        'new',
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.textContent, 'new');
    });

    it('will set value with escaped characters', () => {
      const vTree = html``;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.NODE_VALUE,
        vTree,
        '\xB1',
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.textContent, '±');
    });

    it('will set value with HTML entities', () => {
      const vTree = html``;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.NODE_VALUE,
        vTree,
        '&#xB1;',
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.textContent, '±');
    });

    it('will set value over existing value', () => {
      const vTree = html`old`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.NODE_VALUE,
        vTree,
        'new',
        'old',
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.textContent, 'new');
    });

    it('will set value for block elements', () => {
      const text = html``;
      const vTree = html`<pre>${text}</pre>`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.NODE_VALUE,
        text,
        'inner contents',
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.innerHTML, 'inner contents');
    });

    it('will set value after promise resolution', async () => {
      const text = html`old contents`;
      const vTree = html`<pre>${text}</pre>`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.NODE_VALUE,
        text,
        'new contents',
        null,
      ];

      const promise = Promise.resolve();

      addTransitionState('textChanged', () => promise);
      const promises = patchNode(patches);

      equal(domNode.innerHTML, 'old contents');

      await Promise.all(promises);

      release(domNode);

      equal(promises[0], promise);
      equal(domNode.innerHTML, 'new contents');
    });

    it('will insert node into container', () => {
      const vTree = html`<div />`;
      const nested = html`<span />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.INSERT_BEFORE,
        vTree,
        nested,
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.innerHTML, '<span></span>');
    });

    it('will insert node into end of container (append)', () => {
      const vTree = html`<div><p /></div>`;
      const nested = html`<span />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.INSERT_BEFORE,
        vTree,
        nested,
        null,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.innerHTML, '<p></p><span></span>');
    });

    it('will insert node into start of container (prepend)', () => {
      const first = html`<p />`;
      const vTree = html`<div>${first}</div>`;
      const nested = html`<span />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.INSERT_BEFORE,
        vTree,
        nested,
        first,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.innerHTML, '<span></span><p></p>');
    });

    it('will insert only if previously created', () => {
      const vTree = html`<div />`;
      const nested = html`<span />`;

      const patches = [
        PATCH_TYPE.INSERT_BEFORE,
        vTree,
        nested,
        null,
      ];

      patchNode(patches);

      equal(createNode(vTree).innerHTML, '');
    });

    it('will insert node before promise resolution', async () => {
      const vTree = html`<div />`;
      const nested = html`<span />`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.INSERT_BEFORE,
        vTree,
        nested,
        null,
      ];

      const promise = Promise.resolve();

      addTransitionState('attached', () => promise);
      const promises = patchNode(patches);

      equal(domNode.innerHTML, '<span></span>');

      await Promise.all(promises);

      release(domNode);

      equal(promises[0], promise);
      equal(domNode.innerHTML, '<span></span>');
    });

    it('will replace if nodes are different', () => {
      const old = html`<span />`;
      const next = html`<p />`;
      const vTree = html`<div>${old}</div>`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.REPLACE_CHILD,
        next,
        old,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.innerHTML, '<p></p>');
    });

    it('will replace only if node was previously created', () => {
      const old = html`<span />`;
      const next = html`<p />`;
      const vTree = html`<div>${old}</div>`;

      const patches = [
        PATCH_TYPE.REPLACE_CHILD,
        next,
        old,
      ];

      patchNode(patches);

      equal(createNode(vTree).innerHTML, '<span></span>');
    });

    it('will replace after promise resolution, but will insert before', async () => {
      const old = html`<span />`;
      const next = html`<p />`;
      const vTree = html`<div>${old}</div>`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.REPLACE_CHILD,
        next,
        old,
      ];

      const promise = Promise.resolve();

      addTransitionState('replaced', () => promise);
      const promises = patchNode(patches);

      equal(domNode.innerHTML, '<p></p><span></span>');

      await Promise.all(promises);

      release(domNode);

      equal(promises[0], promise);
      equal(domNode.innerHTML, '<p></p>');
    });

    it('will remove node', () => {
      const old = html`<span />`;
      const vTree = html`<div>${old}</div>`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.REMOVE_CHILD,
        old,
      ];

      patchNode(patches);
      release(domNode);

      equal(domNode.innerHTML, '');
    });

    it('will remove only if node was previously created', () => {
      const old = html`<span />`;
      const vTree = html`<div>${old}</div>`;

      const patches = [
        PATCH_TYPE.REMOVE_CHILD,
        old,
      ];

      patchNode(patches);

      equal(createNode(vTree).innerHTML, '<span></span>');
    });

    it('will remove after promise resolution', async () => {
      const old = html`<span />`;
      const vTree = html`<div>${old}</div>`;
      const domNode = createNode(vTree);

      const patches = [
        PATCH_TYPE.REMOVE_CHILD,
        old,
      ];

      const promise = Promise.resolve();

      addTransitionState('detached', () => promise);
      const promises = patchNode(patches);

      equal(domNode.innerHTML, '<span></span>');

      await Promise.all(promises);

      release(domNode);

      equal(promises[0], promise);
      equal(domNode.innerHTML, '');
    });
  });
});
