import { deepEqual, equal, throws, doesNotThrow } from 'assert';
import { innerHTML, html, createTree, use, release } from 'diffhtml';
import PropTypes from 'prop-types';
import WebComponent from '../lib/web-component';
import validateCaches from './util/validate-caches';

describe.skip('Web Component', function() {
  beforeEach(() => {
    newJSDOMSandbox();

    this.fixture = document.createElement('div');
    process.env.NODE_ENV = 'development';
    document.body.appendChild(this.fixture);
    WebComponent.subscribeMiddleware();
  });

  afterEach(() => {
    release(this.fixture.firstChild);
    release(this.fixture);
    WebComponent.unsubscribeMiddleware();
    document.body.removeChild(this.fixture);
    validateCaches();
  });

  it('can make a component', () => {
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

    equal(instance.shadowRoot.firstChild.outerHTML, '<div>Hello world</div>');
    equal(this.fixture.innerHTML, '<custom-component></custom-component>');
  });

  describe('Props', () => {
    it('can pass properties to constructor', () => {
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

    it('can pass children in properties to constructor', () => {
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
    it('can render JSX', () => {
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

    it('can render JSX with props', () => {
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

      equal(domNode.firstChild.shadowRoot.firstChild.outerHTML, '<div>Hello world!</div>');
      equal(domNode.outerHTML, '<div><jsx-test message="Hello world!"></jsx-test></div>');
    });
  });

  describe('Stateful components', () => {
    it('can rerender with setState', () => {
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

      innerHTML(this.fixture, html`<stateful-test ref=${node => ref = node} />`);
      equal(this.fixture.firstChild.shadowRoot.firstChild.outerHTML, '<div>default</div>');

      ref.setState({ msg: 'it works' });

      equal(this.fixture.firstChild.shadowRoot.firstChild.outerHTML, '<div>it works</div>');
    });
  });
});
