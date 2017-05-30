import { equal, throws, doesNotThrow } from 'assert';
import { innerHTML, html, createTree, use } from 'diffhtml';
import PropTypes from 'prop-types';
import WebComponent from '../lib/web-component';

describe('Web Component', function() {
  beforeEach(() => {
    newJSDOMSandbox();
  });

  after(() => {
    WebComponent.unsubscribeMiddleware();
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

    innerHTML(document.body, html`<custom-component />`);

    const instance = document.body.querySelector('custom-component');

    equal(instance.shadowRoot.firstChild.outerHTML, '<div>Hello world</div>');
    equal(document.body.innerHTML, '<custom-component></custom-component>');
  });

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

    innerHTML(document.body, html`<custom-component message="Test" />`);

    equal(ctorMessage, 'Test');
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

      innerHTML(document.body, <jsx-test />);

      const output = document.createElement('div');
      output.appendChild(document.body.firstChild.shadowRoot);

      equal(output.innerHTML, '<div>Hello world</div>');
      equal(document.body.innerHTML, '<jsx-test></jsx-test>');
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
      document.body.appendChild(domNode);

      innerHTML(domNode, <jsx-test message="Hello world!" />);

      equal(domNode.firstChild.shadowRoot.firstChild.outerHTML, '<div>Hello world!</div>');
      equal(domNode.outerHTML, '<div><jsx-test message="Hello world!"></jsx-test></div>');
    });
  });
});
