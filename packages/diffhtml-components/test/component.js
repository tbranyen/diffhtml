import { equal, throws, doesNotThrow } from 'assert';
import { innerHTML, html, use } from 'diffhtml';
import process from 'diffhtml-shared-internals/dist/cjs/process';
import PropTypes from 'proptypes';
import Component from '../lib/component';

describe.skip('React Like Component', function() {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

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

    equal(oldTree.outerHTML, '<div><div>Hello world</div></div>');
  });

  it('cannot return multiple elements yet', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
          <p>Test</p>
        `;
      }
    }

    const oldTree = document.createElement('div');

    throws(() => innerHTML(oldTree, html`<${CustomComponent} />`));
  });

  it.skip('can return multiple elements', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
          <p>Test</p>
        `;
      }
    }

    const oldTree = document.createElement('div');
    innerHTML(oldTree, html`<${CustomComponent} />`);

    equal(oldTree.outerHTML, '<div><div>Hello world</div><p>test</p></div>');
  });

  describe('Lifecycle', () => {
    it.skip('can map to shouldComponentUpdate', () => {});
    it.skip('can map to componentWillReceiveProps', () => {});
    it.skip('can map to componentDidMount', () => {});
    it.skip('can map to componentDidUpdate', () => {});
    it.skip('can map to componentWillUnmount', () => {});
    it.skip('can map to componentDidUnmount', () => {});
  });

  describe('Props', () => {
    it('can set simple string', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      const vTree = html`<${CustomComponent} test="true" />`;

      equal(vTree.attributes.test, 'true');
    });

    it('can set complex object', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      const ref = {};
      const vTree = html`<${CustomComponent} test=${ref} />`;

      equal(vTree.attributes.test, ref);
    });

    it('can throw if missing proptypes in development', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      CustomComponent.propTypes = {
        customProperty: PropTypes.string.isRequired,
      };

      const oldTree = document.createElement('div');

      throws(() => innerHTML(oldTree, html`<${CustomComponent} />`));
    });

    it('cannot throw if missing proptypes in production', () => {
      process.env.NODE_ENV = 'production';

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      CustomComponent.propTypes = {
        customProperty: PropTypes.string.isRequired,
      };

      const oldTree = document.createElement('div');

      doesNotThrow(() => innerHTML(oldTree, html`<${CustomComponent} />`));
    });

    //it('can
  });

  describe('State', () => {
    it.skip('can set state', () => {});
  });

  describe('Context', () => {
    it.skip('can ', () => {});
  });
});
