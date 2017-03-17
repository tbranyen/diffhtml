import { equal } from 'assert';
import { innerHTML, html, use } from 'diffhtml';
import { Component } from '../lib';

describe('React Like Component', function() {
  it('can make a component', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    const oldTree = document.createElement('div');
    innerHTML(oldTree, html`<${CustomComponent} />`);

    equal(oldTree.outerHTML, '<div>Hello world</div>');
  });
});
