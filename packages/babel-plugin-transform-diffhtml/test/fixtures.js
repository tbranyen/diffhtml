'use strict';

const { createTree, html } = require('diffhtml');

BASICS: {

  exports.renderTemplateLiteral = () => `
    <div></div>
  `;

  exports.warnsOnInvalidMarkup = () => html`
    <div></span>
  `;

  exports.willRenderSingleElement = () => html`<div></div>`;

}

QUASIS: {

  exports.renderSimpleQuasi = () => html`<div>Hello world</div>`;

  exports.renderNestedQuasi = () => html`${html`<div>Hello world</div>`}`;

  exports.renderNestedQuasiConcat = () => html`${html`Text Node <div>Hello world</div>`}`;

}

EXPRESSIONS: {

  exports.renderStringExpression = () => html`
    ${'Hello world'}
  `;

  exports.renderInterpolatedStringExpression = () => html`
    Hello ${'world'}!
  `;

  exports.renderInterpolatedMixedExpression = () => {
    const text = () => html`world`;
    return html`Hello ${text()}!`;
  };

  exports.renderNestedInterpolatedMixedExpression = () => {
    const text = () => html`world`;
    return html`<div><div>Hello ${text()}!</div></div>`;
  };

  exports.renderNestedTemplateInterpolatedMixedExpression = () => {
    const text = () => html`world`;
    return html`<div>
      ${html`
        <div>Hello ${text()}!</div>
      `}
    </div>`;
  };

  exports.renderTrailingExpression = () => {
    const text = () => html`Hello world`;
    return html`<div></div> ${text()}`;
  };

  exports.renderRealWorld = () => {
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

  exports.renderWithKey = () => {
    const getDate = () => Date.now();

    return html`<ul>
      <li key=${getDate()}>hello</li>
      <li key=${getDate()}>world</li>
    </ul>`;
  };
}

VIRTUAL_TREES: {

  exports.generateStaticTree = () => html`
    <div></div>
  `;

  exports.generateDynamicTree = () => {
    const myVar = Math.random() * Date.now();
    return html`<div>${myVar}</div>`;
  };

}

ATTRIBUTES: {

  exports.dynamicKeyAndValue = (key, value) => html`
    <div ${key}=${value} />
  `;

  exports.setSingleValue = value => html`
    <div class=${value} />
  `;

  exports.setInterpolatedKeyAfter = key => html`
    <div data-${key}="test" />
  `;

  exports.setInterpolatedKeyBefore = key => html`
    <div ms-${key}="test" />
  `;

  exports.setInterpolatedValueAfter = value => html`
    <div class="test ${value}" />
  `;

  exports.setInterpolatedValueBefore = value => html`
    <div class="${value} test" />
  `;

}

BUG_FIXES: {

  exports.interpolatedValuesAreConcat = () => {
    const createSecond = () => html`<div>second</div>`;

    return html`<div>
      Text node ${createSecond()}
    </div>`;
  };

}

FRAGMENTS: {

  exports.willCreateFragments = () => {
    return html`<div></div><span></span>`;
  };

}
