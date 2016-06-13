'use strict';

const setup = require('./setup');
const diff = require('diffhtml');

BASICS: {
  exports.renderTemplateLiteral = () => `
    <div></div>
  `;
}

QUASIS: {

  exports.renderSimpleQuasi = () => html`
    <div>Hello world</div>
  `;

  exports.renderNestedQuasi = () => html`
    ${html`
      <div>Hello world</div>
    `}
  `;

  exports.renderNestedQuasiConcat = () => html`
    ${html`
       Text Node <div>Hello world</div>
    `}
  `;

}

EXPRESSIONS: {

  exports.renderStringExpression = () => html`
    ${'Hello world'}
  `;

  exports.renderInterpolatedStringExpression = () => html`
    Hello ${'world'}!
  `;

  exports.renderInterpolatedMixedExpression = () => {
    const text = () => 'world';
    return html`Hello ${text()}!`;
  };

  exports.renderNestedInterpolatedMixedExpression = () => {
    const text = () => 'world';
    return html`<div>
      <div>Hello ${text()}!</div>
    </div>`;
  };

  exports.renderNestedTemplateInterpolatedMixedExpression = () => {
    const text = () => 'world';
    return html`<div>
      ${html`
        <div>Hello ${text()}!</div>
      `}
    </div>`;
  };

  exports.renderTrailingExpression = () => {
    const text = () => 'Hello world';
    return html`<div><div></div> ${text()}</div>`;
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
