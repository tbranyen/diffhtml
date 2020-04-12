/// <reference types="mocha" />

import { deepEqual, equal, ok } from 'assert';
import { innerHTML, html, createTree, release } from 'diffhtml';
import PropTypes from 'prop-types';
import validateCaches from './util/validate-caches';

const whitespaceEx = /[ ]{2,}|\n/g;

describe('Web Component', function() {
  let WebComponent = null;

  beforeEach(() => {
    newJSDOMSandbox();

    delete require.cache[require.resolve('../lib/web-component')];
    WebComponent = require('../lib/web-component');

    this.fixture = document.createElement('div');
    process.env.NODE_ENV = 'development';
    document.body.appendChild(this.fixture);
    WebComponent.subscribeMiddleware();
  });

  afterEach(() => {
    release(this.fixture);
    WebComponent.unsubscribeMiddleware();
    document.body.removeChild(this.fixture);
    validateCaches();
  });

  it('will render a component', () => {
    class CustomComponent extends WebComponent {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    customElements.define('custom-component', CustomComponent);
    innerHTML(this.fixture, html`<custom-component />`);

    const instance = this.fixture.querySelector('custom-component');

    equal(instance.shadowRoot.childNodes[1].outerHTML, '<div>Hello world</div>');
    equal(this.fixture.innerHTML, '<custom-component></custom-component>');
  });

  it('will render a nested component', () => {
    class CustomComponent extends WebComponent {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    customElements.define('custom-component', CustomComponent);
    innerHTML(this.fixture, html`<div><custom-component /></div>`);

    const instance = this.fixture.querySelector('custom-component');

    equal(instance.shadowRoot.childNodes[1].outerHTML, '<div>Hello world</div>');
    equal(this.fixture.innerHTML, '<div><custom-component></custom-component></div>');
  });

  it('will re-render a component', () => {
    class CustomComponent extends WebComponent {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    customElements.define('custom-component', CustomComponent);

    innerHTML(this.fixture, html`<custom-component />`);
    innerHTML(this.fixture, html`<custom-component />`);

    const instance = this.fixture.querySelector('custom-component');

    equal(instance.shadowRoot.childNodes[1].outerHTML, '<div>Hello world</div>');
    equal(this.fixture.innerHTML, '<custom-component></custom-component>');
  });

  it('will re-render a component with props', () => {
    class CustomComponent extends WebComponent {
      render() {
        return html`
          <div>${this.props.message}</div>
        `;
      }

      static propTypes = {
        message: PropTypes.string,
      }
    }

    customElements.define('custom-component', CustomComponent);

    innerHTML(this.fixture, html`<custom-component message="hello" />`);
    innerHTML(this.fixture, html`<custom-component message="world" />`);

    const instance = this.fixture.querySelector('custom-component');

    equal(instance.shadowRoot.childNodes[1].outerHTML, '<div>world</div>');
    equal(this.fixture.innerHTML, '<custom-component message="world"></custom-component>');
  });

  it('will re-render a nested component', () => {
    class CustomComponent extends WebComponent {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    customElements.define('custom-component', CustomComponent);

    innerHTML(this.fixture, html`<div><custom-component /></div>`);
    innerHTML(this.fixture, html`<div><custom-component /></div>`);

    const instance = this.fixture.querySelector('custom-component');

    equal(instance.shadowRoot.childNodes[1].outerHTML, '<div>Hello world</div>');
    equal(this.fixture.innerHTML, '<div><custom-component></custom-component></div>');
  });

  it('will re-render a nested component with props', () => {
    class OuterComponent extends WebComponent {
      render() {
        return html`
          <slot></slot>
        `;
      }
    }

    class InnerComponent extends WebComponent {
      render() {
        return html`
          <div>${this.props.message}</div>
        `;
      }

      static propTypes = {
        message: PropTypes.string,
      }
    }

    customElements.define('inner-component', InnerComponent);
    customElements.define('outer-component', OuterComponent);

    innerHTML(this.fixture, html`
      ${html``}

      ${false}
    `);

    innerHTML(this.fixture, html`
      ${false}

      ${html`
        <outer-component>
          ${html`<inner-component message="world" />`}
        </outer-component>
      `}
    `);

    const inner = this.fixture.querySelector('inner-component');
    const outer = this.fixture.querySelector('outer-component');

    equal(inner.shadowRoot.childNodes[1].outerHTML, '<div>world</div>');
    equal(
      this.fixture.innerHTML.replace(whitespaceEx, ''),
      '<outer-component><inner-component message="world"></inner-component></outer-component>',
    );
  });

  it('will render a nested component', () => {
    class InnerComponent extends WebComponent {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    class CustomComponent extends WebComponent {
      render() {
        return html`
          <div><slot></slot></div>
        `;
      }
    }

    customElements.define('custom-component', CustomComponent);
    customElements.define('inner-component', InnerComponent);

    innerHTML(this.fixture, html`
      <custom-component>
        <inner-component />
      </custom-component>
    `);

    const instance = this.fixture.querySelector('custom-component');
    const inner = this.fixture.querySelector('inner-component');

    equal(
      instance.shadowRoot.childNodes[1].outerHTML,
      '<div><slot></slot></div>',
    );

    equal(
      inner.shadowRoot.innerHTML.replace(whitespaceEx, ''),
      '<div>Hello world</div>',
    );

    equal(
      this.fixture.innerHTML.replace(whitespaceEx, ''),
      '<custom-component><inner-component></inner-component></custom-component>',
    );
  });

  describe('Props', () => {
    it('will pass properties to constructor', () => {
      let ctorMessage = null;

      class CustomComponent extends WebComponent {
        render({ message }) {
          return html`
            <div>${message}</div>
          `;
        }

        constructor(props) {
          super(props);

          ctorMessage = props.message;
        }
      }

      customElements.define('custom-component', CustomComponent);
      innerHTML(this.fixture, html`<custom-component message="Test" />`);

      equal(ctorMessage, 'Test');
    });

    it('will pass children in properties to constructor', () => {
      let children = null;

      class CustomComponent extends WebComponent {
        render({ message }) {
          return html`
            <div>${message}</div>
          `;
        }

        constructor(props) {
          super(props);

          children = props.children;
        }
      }

      customElements.define('custom-component', CustomComponent);

      innerHTML(this.fixture, html`<custom-component message="Test">
        <span>Testing</span>
      </custom-component>`);

      deepEqual(children, [
        createTree('#text', '\n        '),
        createTree('span', null, 'Testing'),
        createTree('#text', '\n      '),
      ]);
    });
  });

  describe('JSX Compatibility', () => {
    it('will render JSX', () => {
      customElements.define('jsx-test', class extends WebComponent {
        render() {
          return (
            <div>Hello world</div>
          );
        }
      });

      innerHTML(this.fixture, <jsx-test />);

      const output = document.createElement('div');
      output.appendChild(this.fixture.firstChild.shadowRoot);

      equal(output.innerHTML, '<div>Hello world</div>');
      equal(this.fixture.innerHTML, '<jsx-test></jsx-test>');
    });

    it('will render JSX with props', () => {
      customElements.define('jsx-test', class extends WebComponent {
        render() {
          const { message } = this.props;

          return (
            <div>{message}</div>
          );
        }

        static propTypes = {
          message: PropTypes.string,
        }
      });

      const domNode = document.createElement('div');
      this.fixture.appendChild(domNode);

      innerHTML(domNode, <jsx-test message="Hello world!" />);

      equal(
        domNode.firstChild.shadowRoot.querySelector('div').outerHTML,
        '<div>Hello world!</div>',
      );

      equal(
        domNode.outerHTML,
        '<div><jsx-test message="Hello world!"></jsx-test></div>',
      );
    });
  });

  describe('Stateful components', () => {
    it('will re-render with setState', () => {
      let ref = null;

      customElements.define('stateful-test', class extends WebComponent {
        render() {
          const { msg } = this.state;

          return html`
            <div>${msg}</div>
          `;
        }

        state = {
          msg: 'default'
        }
      });

      innerHTML(
        this.fixture,
        html`<stateful-test ref=${node => ref = node} />`,
      );

      equal(
        this.fixture.firstChild.shadowRoot.childNodes[1].outerHTML,
        '<div>default</div>',
      );

      ref.setState({ msg: 'it works' });

      equal(
        this.fixture.firstChild.shadowRoot.childNodes[1].outerHTML,
        '<div>it works</div>',
      );
    });
  });
});
