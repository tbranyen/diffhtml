import { ok, equal, throws, doesNotThrow } from 'assert';
import { innerHTML, html, use } from 'diffhtml';
import process from 'diffhtml-shared-internals/lib/process';
import PropTypes from 'proptypes';
import Component from '../lib/component';

describe('React Like Component', function() {
  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  after(() => {
    Component.unsubscribeMiddleware();
  });

  it('can make a component', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    const domNode = document.createElement('div');
    innerHTML(domNode, html`<${CustomComponent} />`);

    equal(domNode.outerHTML, '<div><div>Hello world</div></div>');
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

    const domNode = document.createElement('div');

    throws(() => innerHTML(domNode, html`<${CustomComponent} />`));
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

    const domNode = document.createElement('div');
    innerHTML(domNode, html`<${CustomComponent} />`);

    equal(domNode.outerHTML, '<div><div>Hello world</div><p>test</p></div>');
  });

  describe('Lifecycle', () => {
    it('can map to shouldComponentUpdate', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }

        shouldComponentUpdate() {
          wasCalled = true;
          return false;
        }
      }

      let ref = null;
      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${CustomComponent} ref=${node => (ref = node)} />`);

      equal(domNode.innerHTML, 'default');
      ref.setState({ message: 'something' });
      equal(domNode.innerHTML, 'default');
      ok(wasCalled);
    });

    it('can map to componentWillReceiveProps', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }

        componentWillReceiveProps() {
          wasCalled = true;
          return false;
        }
      }

      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${CustomComponent} someProp="true" />`);
      innerHTML(domNode, html`<${CustomComponent} someProp="false" />`);

      ok(wasCalled);
    });

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

      const domNode = document.createElement('div');

      throws(() => innerHTML(domNode, html`<${CustomComponent} />`));
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

      const domNode = document.createElement('div');

      doesNotThrow(() => innerHTML(domNode, html`<${CustomComponent} />`));
    });

  });

  describe('Refs', () => {
    it('can invoke a ref attribute on a Component', () => {
      let refNode = null;

      class CustomComponent extends Component {
        render() {
          return html`<div ref=${node => (refNode = node)}/>`;
        }
      }

      const domNode = document.createElement('div');

      innerHTML(domNode, html`<${CustomComponent}
        ref=${node => (refNode = node)}
      />`);

      ok(refNode);
    });

    it('can invoke a ref attribute on a DOM Node', () => {
      let refNode = null;

      class CustomComponent extends Component {
        render() {
          return html`<div>
            <div ref=${node => (refNode = node)} />
          </div>`;
        }
      }

      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${CustomComponent} />`);
      ok(refNode);
      equal(domNode.nodeName, 'DIV');
    });
  });

  describe('State', () => {
    it('will always be an object', () => {
      let state = null;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        constructor() {
          super();
          state = this.state;
        }
      }

      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${CustomComponent} />`);
      equal(typeof state, 'object');
    });

    it('can set state in constructor', () => {
      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor() {
          super();
          this.state.message = 'default'
        }
      }

      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${CustomComponent} />`);
      equal(domNode.innerHTML, 'default');
    });

    it('can call setState to re-render the component', () => {
      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }
      }

      let ref = null;
      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${CustomComponent} ref=${node => (ref = node)} />`);

      equal(domNode.innerHTML, 'default');
      ref.setState({ message: 'something' });
      equal(domNode.innerHTML, 'something');
    });

  });

  describe('forceUpdate', () => {
    it('can set state manually and call forceUpdate', () => {
      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }
      }

      let ref = null;
      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${CustomComponent} ref=${node => (ref = node)} />`);

      equal(domNode.innerHTML, 'default');
      ref.state.message = 'something';
      ref.forceUpdate();
      equal(domNode.innerHTML, 'something');
    });
  });

  describe('Context', () => {
    it.skip('can inherit context from a parent component', () => {
      class ChildComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }
      }

      class ParentComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }
      }

      const domNode = document.createElement('div');
      innerHTML(domNode, html`<${ParentComponent} />`);
    });
  });
});
