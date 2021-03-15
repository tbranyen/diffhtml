import { strictEqual, deepStrictEqual } from 'assert';
import Component from '../lib/component';
import diff from '../lib/util/binding';
import globalThis from '../lib/util/global';
import validateCaches from './util/validate-caches';

const { html, release, innerHTML, toString, createTree } = diff;
const { document } = globalThis;

describe('Component', function() {
  beforeEach(() => {
    newJSDOMSandbox();
    Component.subscribeMiddleware();
  });

  afterEach(() => {
    Component.unsubscribeMiddleware();
    release(this.fixture);
    validateCaches();
  });

  it('will retain the name property', () => {
    class TestComponent extends Component {}
    strictEqual(TestComponent.name, 'TestComponent');
  });

  describe('Default props', () => {
    it('will support defining default props as null', () => {
      class TestComponent extends Component {
        static defaultProps = null
      }

      const testComponent = new TestComponent();
      deepStrictEqual(testComponent.props, {});
    });

    it('will not support other types for default props', () => {
      {
        class TestComponent extends Component {
          static defaultProps = 'test'
        }

        const testComponent = new TestComponent();
        deepStrictEqual(testComponent.props, {});
      }
      {
        class TestComponent extends Component {
          static defaultProps = ['test']
        }

        const testComponent = new TestComponent();
        deepStrictEqual(testComponent.props, {});
      }
      {
        class TestComponent extends Component {
          static defaultProps = true
        }

        const testComponent = new TestComponent();
        deepStrictEqual(testComponent.props, {});
      }
      {
        class TestComponent extends Component {
          static defaultProps = 5
        }

        const testComponent = new TestComponent();
        deepStrictEqual(testComponent.props, {});
      }
    });

    it('will use defined default props', () => {
      class TestComponent extends Component {
        static defaultProps = {
          test: 'value',
        }
      }

      const testComponent = new TestComponent();

      deepStrictEqual(testComponent.props, {
        test: 'value',
      });
    });

    it('will merge defined default props', () => {
      class TestComponent extends Component {
        static defaultProps = {
          test: 'old',
        }
      }

      const testComponent = new TestComponent({
        test: 'new'
      });

      deepStrictEqual(testComponent.props, {
        test: 'new',
      });
    });
  });

  describe('Props', () => {
    it('will support passing props', () => {
      class TestComponent extends Component {}

      const testComponent = new TestComponent({
        test: 'value'
      });

      deepStrictEqual(testComponent.props, {
        test: 'value',
      });
    });
  });

  describe('render()', () => {
    it('will support omitting render function', () => {
      class TestComponent extends Component {}

      const actual = toString(html`<${TestComponent} />`).trim();

      strictEqual(actual, '');
    });

    it('will support empty render function', () => {
      class TestComponent extends Component {
        render() {}
      }

      const actual = toString(html`<${TestComponent} />`).trim();

      strictEqual(actual, '');
    });

    it('will support render function returning single element', () => {
      class TestComponent extends Component {
        render() {
          return createTree('div');
        }
      }

      const actual = toString(html`<${TestComponent} test="value" />`).trim();

      strictEqual(actual, '<div></div>');
    });

    it('will support render function returning multiple elements', () => {
      class TestComponent extends Component {
        render() {
          return [createTree('div'), createTree('p')];
        }
      }

      const actual = toString(html`<${TestComponent} test="value" />`).trim();

      strictEqual(actual, '<div></div><p></p>');
    });

    it('will support render function returning multiple top-level elements', () => {
      class TestComponent extends Component {
        render() {
          return html`
            <div></div><p></p>
          `;
        }
      }

      const actual = toString(html`<${TestComponent} test="value" />`).trim();

      strictEqual(actual, '<div></div><p></p>');
    });

    it('will support render functions using props', () => {
      class TestComponent extends Component {
        render(props) {
          return html`<div>${props.test}</div>`;
        }
      }

      const actual = toString(html`<${TestComponent} test="value" />`).trim();

      strictEqual(actual, '<div>value</div>');
    });
  });

  describe('refs', () => {
    it('will trigger function ref on component instance', () => {
      let refCalled = [];

      class TestComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      this.fixture = createTree('div');

      innerHTML(this.fixture, html`
        <${TestComponent}
          ref=${(...args) => refCalled.push(args)}
         />
      `);

      strictEqual(refCalled.length, 1);
      strictEqual(refCalled[0][0] instanceof TestComponent, true);
    });

    it('will trigger function ref on rendered element instance', () => {
      let refCalled = [];

      class TestComponent extends Component {
        render() {
          return html`<div ref=${(...args) => refCalled.push(args)} />`;
        }
      }

      this.fixture = createTree('div');

      innerHTML(this.fixture, html`<${TestComponent} />`);

      strictEqual(refCalled.length, 1);
      strictEqual(refCalled[0][0].nodeName, 'DIV');
      strictEqual(refCalled[0][0].constructor.name, 'HTMLDivElement');
    });
  });

  describe('setState', () => {
    it('will trigger a re-render on mounted components', async () => {
      let renderCalled = [];

      class TestComponent extends Component {
        render(...args) {
          renderCalled.push(args);
          const { message } = this.state;
          return html`<div>${message}</div>`;
        }
      }

      this.fixture = document.createElement('div');

      let ref = null;

      innerHTML(this.fixture, html`
        <${TestComponent} ref=${instance => ref = instance} />
      `);

      await ref.setState({ message: 'test' });

      strictEqual(renderCalled.length, 2);
      strictEqual(this.fixture.firstElementChild.outerHTML, '<div>test</div>');
    });

    it('will allow awaiting a re-render', async () => {
      let renderCalled = [];

      class TestComponent extends Component {
        render(...args) {
          renderCalled.push(args);
          const { message } = this.state;
          return html`<div>${message}</div>`;
        }
      }

      this.fixture = document.createElement('div');

      let ref = null;

      innerHTML(this.fixture, html`
        <${TestComponent} ref=${instance => ref = instance} />
      `);

      await ref.setState({ message: 'test' });

      strictEqual(renderCalled.length, 2);
      strictEqual(this.fixture.firstElementChild.outerHTML, '<div>test</div>');
    });

    it('will debounce same-tick calls', async () => {
      let renderCalled = [];

      class TestComponent extends Component {
        render(...args) {
          renderCalled.push(args);
          const { message } = this.state;
          return html`<div>${message}</div>`;
        }
      }

      this.fixture = document.createElement('div');

      let ref = null;

      innerHTML(this.fixture, html`
        <${TestComponent} ref=${instance => ref = instance} />
      `);

      ref.setState({ message: 'call1' });
      await ref.setState({ message: 'call2' });

      strictEqual(this.fixture.firstElementChild.outerHTML, '<div>call2</div>');
      strictEqual(renderCalled.length, 2);
    });
  });

  describe('componentDidMount()', () => {
    it('will not trigger when using toString', () => {
      let componentDidMountCalled = [];

      class TestComponent extends Component {
        render(props) {
          return html`<div>${props.test}</div>`;
        }

        componentDidMount(...args) {
          componentDidMountCalled.push(args);
        }
      }

      toString(html`<${TestComponent} test="value" />`).trim();

      strictEqual(componentDidMountCalled.length, 0);
    });

    it('will trigger when using a mounted render', () => {
      let componentDidMountCalled = [];

      class TestComponent extends Component {
        render(props) {
          return html`<div>${props.test}</div>`;
        }

        componentDidMount(...args) {
          componentDidMountCalled.push(args);
        }
      }

      this.fixture = createTree('div');

      innerHTML(this.fixture, html`<${TestComponent} test="value" />`);

      strictEqual(componentDidMountCalled.length, 1);
    });
  });

  describe('componentDidUpdate()', () => {
    it('will trigger when calling setState', () => {
      let componentDidMountCalled = [];

      class TestComponent extends Component {
        render(props) {
          return html`<div>${props.test}</div>`;
        }

        componentDidMount(...args) {
          componentDidMountCalled.push(args);
        }
      }

      this.fixture = createTree('div');

      innerHTML(this.fixture, html`<${TestComponent} test="value" />`);

      strictEqual(componentDidMountCalled.length, 1);
    });
  });

  describe('Function components', () => {
    it('will support function components', () => {
      function TestComponent() {
        return html`<div></div>`;
      }

      const actual = toString(html`<${TestComponent} />`).trim();

      strictEqual(actual, '<div></div>');
    });

    it('will support function components with props', () => {
      function TestComponent({ label }) {
        return html`<div>${label}</div>`;
      }

      const actual = toString(html`<${TestComponent} label="test" />`).trim();

      strictEqual(actual, '<div>test</div>');
    });
  });

  describe.only('WebComponent', () => {
    it('will support a basic web component with manual registration', () => {
      class HelloWorld extends Component {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      customElements.define('hello-world', HelloWorld);

      this.fixture = document.createElement('div');
      document.body.appendChild(this.fixture);

      innerHTML(this.fixture, html`<hello-world />`);

      strictEqual(this.fixture.firstElementChild.shadowRoot.innerHTML.trim(), '<div>Hello world</div>');
    });

    it('will render a nested component', () => {
      class CustomComponent extends Component {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      this.fixture = document.createElement('div');
      document.body.appendChild(this.fixture);

      customElements.define('custom-component', CustomComponent);
      innerHTML(this.fixture, html`<div><custom-component /></div>`);

      const instance = this.fixture.querySelector('custom-component');

      strictEqual(instance.shadowRoot.childNodes[1].outerHTML, '<div>Hello world</div>');
      strictEqual(this.fixture.innerHTML, '<div><custom-component></custom-component></div>');
    });

    it('will re-render a component', () => {
      class CustomComponent extends Component {
        render() {
          return html`
            <div>Hello world</div>
          `;
        }
      }

      this.fixture = document.createElement('div');
      document.body.appendChild(this.fixture);

      customElements.define('custom-component', CustomComponent);

      innerHTML(this.fixture, html`<custom-component />`);
      innerHTML(this.fixture, html`<custom-component />`);

      const instance = this.fixture.querySelector('custom-component');

      strictEqual(instance.shadowRoot.childNodes[1].outerHTML, '<div>Hello world</div>');
      strictEqual(this.fixture.innerHTML, '<custom-component></custom-component>');
    });

    it('will re-render a component with string props', () => {
      class CustomComponent extends Component {
        render() {
          return html`
            <div>${this.props.message}</div>
          `;
        }

        static propTypes = {
          message: String,
        }
      }

      customElements.define('custom-component', CustomComponent);

      this.fixture = document.createElement('div');
      document.body.appendChild(this.fixture);

      innerHTML(this.fixture, html`<custom-component message="hello" />`);
      innerHTML(this.fixture, html`<custom-component message="world" />`);

      const instance = this.fixture.querySelector('custom-component');

      instance.forceUpdate();

      strictEqual(instance.shadowRoot.childNodes[1].outerHTML, '<div>world</div>');
      strictEqual(this.fixture.innerHTML, '<custom-component message="world"></custom-component>');
    });
  });
});