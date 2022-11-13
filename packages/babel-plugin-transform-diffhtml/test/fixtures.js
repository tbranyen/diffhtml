'use strict';

import { html } from 'diffhtml/lite.js';

// Basic
export const renderTemplateLiteral = () => `
  <div></div>
`;

export const warnsOnInvalidMarkup = () => html`
  <div></span>
`;

export const willRenderSingleElement = () => html`<div></div>`;

// Quasis
export const renderSimpleQuasi = () => html`<div>Hello world</div>`;

export const renderNestedQuasi = () => html`${html`<div>Hello world</div>`}`;

export const renderNestedQuasiConcat = () => html`${html`Text Node <div>Hello world</div>`}`;

// Expressions
export const renderStringExpression = () => html`
  ${'Hello world'}
`;

export const renderInterpolatedStringExpression = () => html`
  Hello ${'world'}!
`;

export const renderInterpolatedMixedExpression = () => {
  const text = () => html`world`;
  return html`Hello ${text()}!`;
};

export const renderNestedInterpolatedMixedExpression = () => {
  const text = () => html`world`;
  return html`<div><div>Hello ${text()}!</div></div>`;
};

export const renderNestedTemplateInterpolatedMixedExpression = () => {
  const text = () => html`world`;
  return html`<div>
    ${html`
      <div>Hello ${text()}!</div>
    `}
  </div>`;
};

export const renderTrailingExpression = () => {
  const text = () => html`Hello world`;
  return html`<div></div> ${text()}`;
};

export const renderRealWorld = () => {
  const todos = [1];

  function setCheckedState() {
    return 'checked';
  }

  function renderTodoList() {
    return 'Hello world';
  }

  return html`
    <header class="header"></header>

    ${todos.length ? html`
      <section class="main">
        <input class="toggle-all" type="checkbox" ${setCheckedState()}>
        <ul class="todo-list">${renderTodoList()}</ul>
      </section>

      <footer class="footer">
        <span class="todo-count">
          <strong>${todos.length}</strong>
          ${todos.length == 1 ? 'item' : 'items'} left
        </span>
      </footer>
    ` : ''}
  `;
};

export const renderWithKey = () => {
  const getDate = () => Date.now();

  return html`<ul>
    <li key=${getDate()}>hello</li>
    <li key=${getDate()}>world</li>
  </ul>`;
};

// Virtual Trees
export const generateStaticTree = () => html`
  <div></div>
`;

export const generateDynamicTree = () => {
  const myVar = Math.random() * Date.now();
  return html`<div>${myVar}</div>`;
};

// Attributes
export const dynamicKeyAndValue = (key, value) => html`
  <div ${key}=${value} />
`;

export const setSingleValue = value => html`
  <div class=${value} />
`;

export const setInterpolatedKeyAfter = key => html`
  <div data-${key}="test" />
`;

export const setInterpolatedKeyBefore = key => html`
  <div ms-${key}="test" />
`;

export const setInterpolatedValueAfter = value => html`
  <div class="test ${value}" />
`;

export const setInterpolatedValueBefore = value => html`
  <div class="${value} test" />
`;

// Bug fixes
export const interpolatedValuesAreConcat = () => {
  const createSecond = () => html`<div>second</div>`;

  return html`<div>
    Text node ${createSecond()}
  </div>`;
};

export const supportsChildNodes = () => {
  const boolean = false;

  return html`<div childNodes=${boolean}></div>`;
};

// Fragments
export const willCreateFragments = () => {
  return html`<div></div><span></span>`;
};
