import { strictEqual, deepStrictEqual } from 'assert';
import Component from '../lib/component';
import diff from '../lib/util/binding';
import globalThis from '../lib/util/global';
import { ComponentTreeCache } from '../lib/util/types';
import validateCaches from './util/validate-caches';

const { html, release, innerHTML, toString, createTree } = diff;
const { document } = globalThis;

describe('Component', function() {
  beforeEach(async () => {
    process.env.NODE_ENV = 'development';
    newJSDOMSandbox();
    (await import('../lib/component')).default.subscribeMiddleware();
  });

  afterEach(async () => {
    release(this.fixture);
    (await import('../lib/component')).default.unsubscribeMiddleware();
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

      const actual = toString(TestComponent).trim();

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

    it('will correctly render an empty text node when a falsy component is rendered', () => {
      {
        class TestComponent extends Component {
          render() {
            return null;
          }
        }

        this.fixture = createTree('div');
        innerHTML(this.fixture, TestComponent);

        const componentVTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
        strictEqual(componentVTree.rawNodeName, TestComponent);
        release(this.fixture);
      }
      {
        class TestComponent extends Component {
          render() {
            return undefined;
          }
        }

        this.fixture = createTree('div');
        innerHTML(this.fixture, TestComponent);

        const componentVTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
        strictEqual(componentVTree.rawNodeName, TestComponent);
        release(this.fixture);
      }
      {
        class TestComponent extends Component {
          render() {
            return false;
          }
        }

        this.fixture = createTree('div');
        innerHTML(this.fixture, TestComponent);

        const componentVTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
        strictEqual(componentVTree.rawNodeName, TestComponent);
        release(this.fixture);
      }
    });

    it('will associate single element rendered to component', () => {
      class TestComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      this.fixture = createTree('div');
      innerHTML(this.fixture, TestComponent);

      const componentVTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
      strictEqual(componentVTree.rawNodeName, TestComponent);
    });

    it('will associate the first element from the start of a fragment', () => {
      class TestComponent extends Component {
        render() {
          return html`
            <div />
            <p />
          `;
        }
      }

      this.fixture = createTree('div');
      innerHTML(this.fixture, TestComponent);

      const componentVTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
      strictEqual(this.fixture.childNodes[0].nodeName, '#text');
      strictEqual(componentVTree.rawNodeName, TestComponent);
    });

    it('will associate a nested component', () => {
      class Level2Component extends Component {
        render() {
          return html`
            <div />
          `;
        }
      }

      class Level1Component extends Component {
        render() {
          return html`
            <${Level2Component} />
          `;
        }
      }

      this.fixture = createTree('div');
      innerHTML(this.fixture, Level1Component);

      const level1VTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
      strictEqual(level1VTree.rawNodeName, Level1Component);

      const level2VTree = ComponentTreeCache.get(this.fixture.childNodes[1]);
      strictEqual(level2VTree.rawNodeName, Level2Component);
    });

    it('will associate two nested components', () => {
      class Level3Component extends Component {
        render() {
          return html`
            <div />
          `;
        }
      }
      class Level2Component extends Component {
        render() {
          return html`
            <${Level3Component} />
          `;
        }
      }

      class Level1Component extends Component {
        render() {
          return html`
            <${Level2Component} />
          `;
        }
      }

      this.fixture = createTree('div');
      innerHTML(this.fixture, Level1Component);

      const level1VTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
      strictEqual(level1VTree.rawNodeName, Level1Component);

      const level2VTree = ComponentTreeCache.get(this.fixture.childNodes[1]);
      strictEqual(level2VTree.rawNodeName, Level2Component);

      const level3VTree = ComponentTreeCache.get(this.fixture.childNodes[2]);
      strictEqual(level3VTree.rawNodeName, Level3Component);
    });

    it('will associate a nested function component', () => {
      function Level2Component() {
        return html`
          <div />
        `;
      }

      class Level1Component extends Component {
        render() {
          return html`
            <${Level2Component} />
          `;
        }
      }

      this.fixture = createTree('div');
      innerHTML(this.fixture, Level1Component);

      const level1VTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
      strictEqual(level1VTree.rawNodeName, Level1Component);

      const level2VTree = ComponentTreeCache.get(this.fixture.childNodes[1]);
      strictEqual(level2VTree.rawNodeName, Level2Component);
    });

    it('will associate a nested function component when passed directly', () => {
      function Level2Component() {
        return html`
          <div />
        `;
      }

      class Level1Component extends Component {
        render() {
          return html`<${Level2Component} />`;
        }
      }

      this.fixture = createTree('div');
      innerHTML(this.fixture, Level1Component);

      // Always the most inner component rendered and work outwards.
      const level2VTree = ComponentTreeCache.get(this.fixture.childNodes[0]);
      strictEqual(level2VTree.rawNodeName, Level2Component);

      const level1VTree = ComponentTreeCache.get(level2VTree);
      strictEqual(level1VTree.rawNodeName, Level1Component);
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

  describe('WebComponent', () => {
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

      strictEqual(instance.shadowRoot.childNodes[0].outerHTML, '<div>Hello world</div>');
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

      strictEqual(instance.shadowRoot.childNodes[0].outerHTML, '<div>Hello world</div>');
      strictEqual(this.fixture.innerHTML, '<custom-component></custom-component>');
    });

    it('will re-render a component with string props', async () => {
      class CustomComponent extends Component {
        render() {
          return html`
            <div>${this.props.message}</div>
          `;
        }

        static defaultProps = {
          message: '',
        }
      }

      customElements.define('custom-component', CustomComponent);

      this.fixture = document.createElement('div');
      document.body.appendChild(this.fixture);

      innerHTML(this.fixture, html`<custom-component message="hello" />`);
      innerHTML(this.fixture, html`<custom-component message="world" />`);

      const instance = this.fixture.querySelector('custom-component');

      strictEqual(instance.shadowRoot.firstElementChild.outerHTML, '<div>world</div>');
      strictEqual(this.fixture.innerHTML, '<custom-component message="world"></custom-component>');
    });
  });
});
