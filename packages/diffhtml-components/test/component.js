/// <reference types="mocha" />

import { ok, equal, deepEqual, doesNotThrow, throws } from 'assert';
import {
  use,
  innerHTML,
  html,
  release,
  Internals,
  addTransitionState,
  removeTransitionState,
} from 'diffhtml';
import PropTypes from 'prop-types';
import Component from '../lib/component';
import validateCaches from './util/validate-caches';

const { process } = Internals;
const { assign } = Object;
const whitespaceEx = /[ ]{2,}|\n/g;

describe('Component implementation', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    process.env.NODE_ENV = 'development';
    Component.subscribeMiddleware();
  });

  afterEach(() => {
    ['attached', 'detached', 'replaced', 'textChanged', 'attributeChanged']
      .forEach(transitionName => removeTransitionState(transitionName));

    release(this.fixture);
    Component.unsubscribeMiddleware();
    validateCaches();
  });

  it('will render a component', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    innerHTML(this.fixture, html`<${CustomComponent} />`);

    equal(
      this.fixture.outerHTML.replace(whitespaceEx, ''),
      '<div><div>Hello world</div></div>',
    );
  });

  it('will not support returning falsy values', () => {
    class NullComponent extends Component {
      render() {
        return null;
      }
    }

    throws(
      () => innerHTML(this.fixture, html`<${NullComponent} />`),
      /Must return at least one element from render/,
    );
  });

  it('will support rendering empty tree content', () => {
    class CustomComponent extends Component {
      render() {
        return html``;
      }
    }

    innerHTML(this.fixture, html`<${CustomComponent} />`);

    equal(this.fixture.innerHTML, '');
  });

  it('will return multiple top level elements', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
          <p>Test</p>
        `;
      }
    }

    innerHTML(this.fixture, html`<${CustomComponent} />`);

    equal(
      this.fixture.innerHTML.replace(whitespaceEx, ''),
      `<div>Hello world</div><p>Test</p>`,
    );
  });

  it('will support setting default props', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>${this.props.string}</div>
        `;
      }

      static defaultProps = {
        string: 'hello',
      }
    }

    innerHTML(this.fixture, html`<${CustomComponent} />`);

    equal(
      this.fixture.innerHTML.replace(whitespaceEx, ''),
      `<div>hello</div>`,
    );
  });

  it('will support passing prop overrides into constructor', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>${this.props.string}</div>
        `;
      }

      static defaultProps = {
        string: 'hello',
      }
    }

    innerHTML(this.fixture, html`<${CustomComponent} string="world" />`);

    equal(
      this.fixture.innerHTML.replace(whitespaceEx, ''),
      `<div>world</div>`,
    );
  });

  it('will have a component return a component aka HoC', () => {
    class CustomComponent extends Component {
      render({ message }) {
        return html`${message}`;
      }
    }

    const embolden = WrappedComponent => class EmboldenComponent {
      render() {
        return html`
          <b><${WrappedComponent} message="Hello world" /></b>
        `;
      }
    };

    const BoldCustomComponent = embolden(CustomComponent);

    innerHTML(this.fixture, html`<${BoldCustomComponent} />`);

    equal(
      this.fixture.outerHTML.replace(whitespaceEx, ''),
      '<div><b>Hello world</b></div>',
    );
  });

  it('will have a series of HoC', () => {
    class CustomComponent extends Component {
      render({ message }) {
        return html`${message}`;
      }
    }

    const embolden = WrappedComponent => class EmboldenComponent {
      render({ message }) {
        return html`
          <b><${WrappedComponent} message=${message} /></b>
        `;
      }
    };

    const spanify = WrappedComponent => class SpanifyComponent {
      render({ message }) {
        return html`
          <span><${WrappedComponent} message=${message} /></span>
        `;
      }
    };

    const BoldAndSpanned = spanify(embolden(CustomComponent));

    innerHTML(this.fixture, html`<${BoldAndSpanned} message="Hello world" />`);

    equal(
      this.fixture.outerHTML.replace(whitespaceEx, ''),
      '<div><span><b>Hello world</b></span></div>',
    );
  });

  describe('Lifecycle', () => {
    it('will map to componentDidMount', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        componentDidMount() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);

      ok(wasCalled);
    });

    it('will map to componentWillUnmount', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        componentWillUnmount() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);
      innerHTML(this.fixture, html``);

      ok(wasCalled);
    });

    it('will block rendering with shouldComponentUpdate', () => {
      let wasCalled = false;
      let counter = 0;

      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          counter++;
          super(props);
          this.state.message = 'default'
        }

        shouldComponentUpdate() {
          wasCalled = true;
          return false;
        }
      }

      let ref = null;
      innerHTML(this.fixture, html`<${CustomComponent} ref=${node => (ref = node)} />`);
      equal(this.fixture.innerHTML, 'default');
      ref.setState({ message: 'something' });
      equal(this.fixture.innerHTML, 'default');
      ok(wasCalled);
      equal(counter, 1);
    });

    it('will map to componentWillReceiveProps', () => {
      let wasCalled = false;
      let counter = 0;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        constructor(props) {
          counter++;
          super(props);
        }

        componentWillReceiveProps() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);
      innerHTML(this.fixture, html`<${CustomComponent} someProp="false" />`);

      ok(wasCalled);
      equal(counter, 1);
    });

    it('will map root changes to componentDidUpdate', () => {
      let wasCalled = false;
      let counter = 0;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        constructor(props) {
          counter++;
          super(props);
        }

        componentDidUpdate() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);
      innerHTML(this.fixture, html`<${CustomComponent} someProp="false" />`);

      ok(wasCalled);
      equal(counter, 1);
    });
  });

  describe('Props', () => {
    it('will set simple string', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      const vTree = html`<${CustomComponent} test="true" />`;

      equal(vTree.attributes.test, 'true');
    });

    it('will set simple boolean single value', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      const vTree = html`<${CustomComponent} checked />`;

      equal(vTree.attributes.checked, true);
    });

    it('will set complex object', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      const ref = {};
      const vTree = html`<${CustomComponent} test=${ref} />`;

      equal(vTree.attributes.test, ref);
    });

    it('will not throw if missing proptypes in production', () => {
      process.env.NODE_ENV = 'production';

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      CustomComponent.propTypes = {
        customProperty: PropTypes.string.isRequired,
      };

      doesNotThrow(() => innerHTML(this.fixture, html`<${CustomComponent} />`));
    });

    it('will interpolate an object', () => {
      class CustomComponent extends Component {
        render(props) {
          return html`<div ${props} />`;
        }
      }

      const props = { a: true };
      const vTree = html`<${CustomComponent} ${props} />`;

      equal(vTree.attributes.a, true);
    });
  });

  describe('Refs', () => {
    it('will invoke a ref attribute on a Component', () => {
      let refNode = null;

      class CustomComponent extends Component {
        render() {
          return html`<div ref=${node => (refNode = node)}/>`;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent}
        ref=${node => (refNode = node)}
      />`);

      ok(refNode);
    });

    it('will invoke a ref attribute on a DOM Node', () => {
      let refNode = null;
      let count = 0;

      class CustomComponent extends Component {
        render() {
          return html`
            <div>
              <div ref=${node => { refNode = node; count++; }} />
            </div>
          `;
        }
      }

      equal(count, 0);
      innerHTML(this.fixture, html`<${CustomComponent} />`);
      return;
      equal(count, 1);
      ok(refNode);
      equal(refNode.getAttribute('ref'), null);
      equal(this.fixture.nodeName, 'DIV');

      innerHTML(this.fixture, html``);
      ok(!refNode);
      equal(count, 2);
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

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      equal(typeof state, 'object');
    });

    it('will set state in constructor', () => {
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

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      equal(this.fixture.innerHTML, 'default');
    });

    it('will call setState to re-render the component', () => {
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

      innerHTML(this.fixture, html`<${CustomComponent} ref=${node => (ref = node)} />`);

      equal(this.fixture.innerHTML, 'default');
      ref.setState({ message: 'something' });
      equal(this.fixture.innerHTML, 'something');
    });

    it('will update with setState', () => {
      let wasCalled = false;
      let counter = 0;

      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`<div>${message}</div>`;
        }

        constructor(props) {
          counter++;
          super(props);
          this.state.message = 'default';
        }

        shouldComponentUpdate() {
          wasCalled = true;
          return true;
        }
      }

      let ref = null;

      innerHTML(this.fixture, html`<${CustomComponent} ref=${node => (
        ref = node
      )} />`);

      equal(this.fixture.innerHTML, '<div>default</div>');
      ref.setState({ message: 'something' });
      equal(this.fixture.innerHTML, '<div>something</div>');
      ok(wasCalled);
      equal(counter, 1);
    });

    it('will allow inserting top level elements with setState', () => {
      class CustomComponent extends Component {
        render() {
          const { count } = this.state;

          return html`${[...Array(count)].map((__unused, i) => html`
            <div>${String(i)}</div>
          `)}`;
        }

        constructor(props) {
          super(props);
          this.state.count = 2;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      const { firstChild } = this.fixture;

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div>0</div><div>1</div>',
      );

      ref.setState({ count: 3 });

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div>0</div><div>1</div><div>2</div>',
      );

      ref.setState({ count: 1 });

      equal(this.fixture.innerHTML.trim(), '<div>0</div>');
      equal(this.fixture.firstChild, firstChild);
    });

    it('will allow inserting nested elements with setState', () => {
      class CustomComponent extends Component {
        render() {
          const { count } = this.state;

          return html`
            <div>
              ${[...Array(count)].map((__unused, i) => html`
                <div>${String(i)}</div>
              `)}
            </div>
          `;
        }

        constructor(props) {
          super(props);
          this.state.count = 2;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      const { firstChild } = this.fixture;

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div><div>0</div><div>1</div></div>',
      );

      ref.setState({ count: 3 });

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div><div>0</div><div>1</div><div>2</div></div>',
      );

      ref.setState({ count: 1 });

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div><div>0</div></div>',
      );

      equal(this.fixture.firstChild, firstChild);
    });

    it('will allow inserting keyed nested elements with setState', () => {
      class CustomComponent extends Component {
        render() {
          const { count } = this.state;

          return html`
            <div>
              ${[...Array(count)].map((__unused, i) => html`
                <div key=${i}>${String(i)}</div>
              `)}
            </div>
          `;
        }

        constructor(props) {
          super(props);
          this.state.count = 2;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      const { firstChild } = this.fixture;

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div><div key="0">0</div><div key="1">1</div></div>',
      );

      ref.setState({ count: 3 });

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div><div key="0">0</div><div key="1">1</div><div key="2">2</div></div>',
      );

      ref.setState({ count: 1 });

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div><div key="0">0</div></div>',
      );

      equal(this.fixture.firstChild, firstChild);
    });

    it('will allow removing top level elements with setState', () => {
      class CustomComponent extends Component {
        render() {
          const { count } = this.state;

          return html`${[...Array(count)].map((__unused, i) => html`
            <div>${String(i)}</div>
          `)}`;
        }

        constructor(props) {
          super(props);
          this.state.count = 2;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      const { firstChild } = this.fixture;

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div>0</div><div>1</div>',
      );

      ref.setState({ count: 1 });

      equal(
        this.fixture.innerHTML.trim().replace(whitespaceEx, ''),
        '<div>0</div>',
      );
    });
  });

  describe('forceUpdate', () => {
    it('will re-render a component when forceUpdate is called', () => {
      let i = 0;

      class CustomComponent extends Component {
        render() {
          ++i;
          return html`<div>${i}</div>`;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '<div>1</div>');
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '<div>2</div>');
    });

    it('will not call shouldComponentUpdate', () => {
      let i = 0;
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          ++i;
          return html`<div>${i}</div>`;
        }

        shouldComponentUpdate() {
          wasCalled = true;
          return i < 1;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '<div>1</div>');
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '<div>2</div>');
      ok(!wasCalled);
    });

    it('will allow setting state manually', () => {
      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default';
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, 'default');
      ref.state.message = 'something';
      ref.forceUpdate();
      equal(this.fixture.innerHTML, 'something');
    });

    it('will call componentDidUpdate once updated', async () => {
      let wasCalled = false;
      let counter = 0;
      let ref = null;
      let i = 0;

      class CustomComponent extends Component {
        render() {
          return html`<div>${++i}</div>`;
        }

        constructor(props) {
          counter++;
          super(props);
        }

        componentDidUpdate() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent}
        ref=${node => (ref = node)}
        someProp="true"
      />`);

      await ref.forceUpdate();

      ok(wasCalled);
      ok(ref);
      equal(counter, 1);
      equal(i, 2);
    });

    it('will add a single element when re-rendering', () => {
      class CustomComponent extends Component {
        render() {
          const { next } = this.state;

          if (next) {
            return html`<div></div>`;
          }

          return html``;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '');
      ref.state.next = true;
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '<div></div>');
    });

    it('will add a single element when re-rendering in succession', async () => {
      class CustomComponent extends Component {
        render() {
          const { next } = this.state;

          if (next) {
            return html`<div></div>`;
          }

          return html``;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '');
      ref.state.next = true;
      const promises = [];
      promises.push(ref.forceUpdate());
      promises.push(ref.forceUpdate());
      await Promise.all(promises);
      equal(this.fixture.innerHTML, '<div></div>');
    });

    it('will replace a single element when re-rendering', () => {
      class CustomComponent extends Component {
        render() {
          const { next } = this.state;

          if (next) {
            return html`<div></div>`;
          }

          return html`<span></span>`;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '<span></span>');
      ref.state.next = true;
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '<div></div>');
    });

    it('will remove a single element when re-rendering', () => {
      class CustomComponent extends Component {
        render() {
          const { next } = this.state;

          if (next) {
            return html``;
          }

          return html`<span></span>`;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '<span></span>');
      ref.state.next = true;
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '');
    });

    it('will add multiple elements when re-rendering', () => {
      class CustomComponent extends Component {
        render() {
          const { next } = this.state;

          if (next) {
            return html`<div></div><div></div>`;
          }

          return html``;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '');
      equal(this.fixture.childNodes.length, 1);
      ref.state.next = true;
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '<div></div><div></div>');
    });

    it('will add multiple elements when re-rendering in succession', async () => {
      class CustomComponent extends Component {
        render() {
          const { next } = this.state;

          if (next) {
            return html`<div></div><div></div>`;
          }

          return html``;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '');
      ref.state.next = true;
      const promises = [];
      promises.push(ref.forceUpdate());
      promises.push(ref.forceUpdate());
      await Promise.all(promises);
      equal(this.fixture.innerHTML, '<div></div><div></div>');
    });

    it('will remove multiple elements when re-rendering', () => {
      class CustomComponent extends Component {
        render() {
          const { next } = this.state;

          if (next) {
            return html``;
          }

          return html`<div></div><div></div>`;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${CustomComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '<div></div><div></div>');
      ref.state.next = true;
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '');
      equal(this.fixture.childNodes.length, 1);
    });

    it('will add elements from functional component when re-rendering', () => {
      function FunctionComponent({ next }) {
        if (next) {
          return html`<div></div><div></div>`;
        }

        return html``;
      }

      class ClassComponent extends Component {
        render() {
          return html`<${FunctionComponent} next=${this.state.next} />`;
        }

        constructor(props) {
          super(props);
          this.state.next = false;
        }
      }

      let ref = null;

      innerHTML(
        this.fixture,
        html`<${ClassComponent} ref=${node => (ref = node)} />`,
      );

      equal(this.fixture.innerHTML, '');
      equal(this.fixture.childNodes.length, 1);
      ref.state.next = true;
      ref.forceUpdate();
      equal(this.fixture.innerHTML, '<div></div><div></div>');
    });
  });

  describe('Context', () => {
    it('will inherit context from a parent component', () => {
      class ChildComponent extends Component {
        render() {
          return html`${this.context.message}`;
        }
      }

      class ParentComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }

        getChildContext() {
          return {
            message: 'From Context'
          };
        }
      }

      innerHTML(this.fixture, html`<${ParentComponent} />`);

      equal(this.fixture.innerHTML, 'From Context');
    });
  });

  describe('HoC', () => {
    it('will support a component that returns a new component', () => {
      let didMount = 0;

      class CustomComponent extends Component {
        render() {
          return html`<span>Hello world</span>`;
        }
      }

      const HOC = ChildComponent => class HOCComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }

        componentDidMount() {
          didMount++;
        }
      };

      const WrappedComponent = HOC(CustomComponent);
      innerHTML(this.fixture, html`<${WrappedComponent} />`);

      equal(didMount, 1);
      equal(this.fixture.innerHTML, '<span>Hello world</span>');
    });

    it('will support wrapping a component that returns a new component', () => {
      let didMount = 0;

      class CustomComponent extends Component {
        render() {
          return html`<span>Hello world</span>`;
        }
      }

      const HOC = ChildComponent => class HOCComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }

        componentDidMount() {
          didMount++;
        }
      };

      const WrappedComponent = HOC(CustomComponent);
      const DoubleWrappedComponent = HOC(WrappedComponent);
      innerHTML(this.fixture, html`<${DoubleWrappedComponent} />`);

      equal(didMount, 1);
      equal(this.fixture.innerHTML, '<span>Hello world</span>');
    });

    it('will correctly forward props with outer function component', () => {
      let outerProps = null;

      class CustomComponent extends Component {
        render() {
          return html`<span>Hello world</span>`;
        }
      }

      const HOC = ChildComponent => class HOCComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }

        componentDidMount() {
          didMount++;
        }
      };

      const WrappedComponent = HOC(CustomComponent);
      const DoubleWrappedComponent = props => {
        outerProps = props;
        return html``;
      };
      innerHTML(this.fixture, html`<${DoubleWrappedComponent} message="Test" />`);

      deepEqual(outerProps, {
        children: [],
        message: 'Test',
      });
    });

    it('will correctly forward props with outer class component', () => {
      let outerProps = null;

      class CustomComponent extends Component {
        render() {
          return html`<span>Hello world</span>`;
        }
      }

      const HOC = ChildComponent => class HOCComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }

        componentDidMount() {
          didMount++;
        }
      };

      const WrappedComponent = HOC(CustomComponent);

      class DoubleWrappedComponent extends Component {
        render(props) {
          outerProps = props;
          return html``;
        }
      }

      innerHTML(this.fixture, html`<${DoubleWrappedComponent} message="Test" />`);

      deepEqual(outerProps, {
        children: [],
        message: 'Test',
        refs: {},
      });
    });
  });

  describe('Function components', () => {
    it('will render a virtual tree', () => {
      const CustomComponent = () => html`<div>Hello world</div>`;

      innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(this.fixture.outerHTML, '<div><div>Hello world</div></div>');
    });

    it('will render a dom node', () => {
      const CustomComponent = () => assign(document.createElement('div'), {
        innerHTML: 'Hello world',
      });

      innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(this.fixture.outerHTML, '<div><div>Hello world</div></div>');
    });

    it('will render an array of virtual trees', () => {
      const CustomComponent = () => [
        html`<div>Hello</div>`, html`<span>world</span>`
      ];

      innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(this.fixture.outerHTML, '<div><div>Hello</div><span>world</span></div>');
    });

    it('will pass props', () => {
      const CustomComponent = ({ key }) => html`
        <div>${key}</div>
      `;

      innerHTML(this.fixture, html`<${CustomComponent} key="Hello world" />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>Hello world</div></div>',
      );
    });

    it('will update props', async () => {
      const CustomComponent = ({ key }) => html`
        <div>${key}</div>
      `;

      innerHTML(this.fixture, html`<${CustomComponent} key="Hello world" />`);
      innerHTML(this.fixture, html`<${CustomComponent} key="To you!" />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>To you!</div></div>',
      );
    });

    it('will render a nested component and forward props', async () => {
      const NestedComponent = ({ key }) => html`${key}`;

      const CustomComponent = props => html`
        <div><${NestedComponent} ${props} /></div>
      `;

      innerHTML(this.fixture, html`<${CustomComponent} key="Hello world" />`);
      innerHTML(this.fixture, html`<${CustomComponent} key="To you!" />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>To you!</div></div>',
      );
    });

    it('will render a component tree: component / component / component', () => {
      function parent() {
        return html`<${self} />`;
      }

      function self() {
        return html`<${child} />`;
      }

      function child() {
        return html`<${nested} />`;
      }

      function nested() {
        return html`<div>Hello world</div>`;
      }

      innerHTML(this.fixture, html`<${parent} />`);

      equal(this.fixture.innerHTML, '<div>Hello world</div>');
    });

    it('will render a component tree: component / component / dom', () => {
      function parent() {
        return html`<${self} />`;
      }

      function self() {
        return html`<${child} />`;
      }

      function child() {
        return html`<div>Hello world</div>`;
      }

      innerHTML(this.fixture, html`<${parent} />`);

      equal(this.fixture.innerHTML, '<div>Hello world</div>');
    });

    it('will render a component tree: component / dom / dom', () => {
      function parent() {
        return html`<${self} />`;
      }

      function self() {
        return html`<div><${child} /></div>`;
      }

      function child() {
        return html`<div>Hello world</div>`;
      }

      innerHTML(this.fixture, html`<${parent} />`);

      equal(this.fixture.innerHTML, '<div><div>Hello world</div></div>');
    });

    it('will render a component tree: dom / dom / dom', () => {
      function parent() {
        return html`<div><${self} /></div>`;
      }

      function self() {
        return html`<div><${child} /></div>`;
      }

      function child() {
        return html`<div>Hello world</div>`;
      }

      innerHTML(this.fixture, html`<${parent} />`);

      equal(this.fixture.outerHTML, '<div><div><div><div>Hello world</div></div></div></div>');
    });
  });

  describe('Stateless class components', () => {
    it('will render a virtual tree', () => {
      class CustomComponent {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>Hello world</div></div>',
      );
    });

    it('will trigger componentDidMount for a component', () => {
      let hit = 0;

      class CustomComponent {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }

        componentDidMount() {
          hit++;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(hit, 1);
    });

    it('will trigger componentWillUnmount for a component', () => {
      let hit = 0;

      class CustomComponent {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }

        componentWillUnmount() {
          hit++;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      innerHTML(this.fixture, html``);

      equal(hit, 1);
      equal(this.fixture.innerHTML, '');
    });

    it('will trigger shouldComponentUpdate for a component', () => {
      let hit = 0;

      class CustomComponent {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }

        shouldComponentUpdate() {
          hit++;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      equal(hit, 0);

      innerHTML(this.fixture, html`<${CustomComponent} key="value" />`);

      equal(hit, 1);
    });

    it('will prevent render with should component update', () => {
      let hit = 0;

      class CustomComponent {
        render(props) {
          return html`
            <div>${props.key}</div>
          `;
        }

        shouldComponentUpdate() {
          hit++;
          return false;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} key="right" />`);
      innerHTML(this.fixture, html`<${CustomComponent} key="wrong" />`);

      equal(hit, 1);
      equal(
        this.fixture.innerHTML.replace(whitespaceEx, ''),
        '<div>right</div>',
      );
    });
  });

  describe('Transitions', () => {
    it('will render a virtual tree with attached transition (no promise)', () => {
      let attachedCalledWith = null;

      addTransitionState('attached', el => {
        attachedCalledWith = el;
      });

      class CustomComponent extends Component {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>Hello world</div></div>',
      );

      equal(
        attachedCalledWith,
        this.fixture.childNodes[1],
      );
    });

    it('will re-render a virtual tree with attached transition (no promise)', () => {
      let attachedCalledWith = null;
      let calledCount = 0;

      addTransitionState('attached', el => {
        calledCount += 1;
        attachedCalledWith = el;
      });

      class CustomComponent {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>Hello world</div></div>',
      );

      equal(attachedCalledWith, this.fixture.childNodes[1]);
      equal(calledCount, 1);
    });

    it('will render a virtual tree with attached transition (with promise)', async () => {
      addTransitionState('attached', el => {
        return new Promise(resolve => {
          el.textContent = 'Goodbye world';
          resolve();
        });
      });

      class CustomComponent {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      await innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>Goodbye world</div></div>',
      );
    });

    it('will re-render a virtual tree with attached transition (with promise)', async () => {
      addTransitionState('attached', el => {
        return new Promise(resolve => {
          el.textContent = 'Goodbye world';
          resolve();
        });
      });

      class CustomComponent {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      await innerHTML(this.fixture, html`<${CustomComponent} />`);

      equal(
        this.fixture.outerHTML.replace(whitespaceEx, ''),
        '<div><div>Goodbye world</div></div>',
      );
    });
  });
});
