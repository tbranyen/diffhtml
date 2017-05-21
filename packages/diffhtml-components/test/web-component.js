import { equal, throws, doesNotThrow } from 'assert';
import { innerHTML, html, createTree, use } from 'diffhtml';
import PropTypes from 'proptypes';
import WebComponent from '../lib/web-component';

describe.only('Web Component', function() {
  it('can render JSX', () => {
    customElements.define('jsx-test', class extends WebComponent {
      render() {
        const { message } = this.props;

        return (
          <div>{message}</div>
        );
      }
    });

    const domNode = document.createElement('div');
    document.body.appendChild(domNode);

    innerHTML(domNode, <jsx-test message="Hello world!" />);

    equal(domNode.shadowRoot, '<div><jsx-test message="Hello world!"></jsx-test></div>');
    equal(domNode.outerHTML, '<div><jsx-test message="Hello world!"></jsx-test></div>');

    return new Promise(resolve => setTimeout(resolve, 2000));
  });
});
