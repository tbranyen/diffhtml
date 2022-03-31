import { strictEqual, deepStrictEqual, throws, fail, ok } from 'assert';
import { createSideEffect } from '../../lib/create-side-effect';
import { createState } from '../../lib/create-state';
import diff from '../../lib/util/binding';
import globalThis from '../../lib/util/global';
import { ComponentTreeCache } from '../../lib/util/types';
import validateCaches from '../util/validate-caches';

const { html, release, innerHTML, toString, createTree } = diff;
const { document } = globalThis;

describe('Hooks', function() {
  beforeEach(async () => {
    process.env.NODE_ENV = 'development';
    newJSDOMSandbox();
    (await import('../../lib/component')).default.subscribeMiddleware();
  });

  afterEach(async () => {
    release(this.fixture);
    (await import('../../lib/component')).default.unsubscribeMiddleware();
    validateCaches();
  });

  describe('createSideEffect', () => {
    it('will error when executed outside a render function', () => {
      throws(() => {
        createSideEffect(() => {});
      }, /Cannot create side effect unless in render function/);
    });

    it('will error when not passed a function', () => {
      function Component() {
        createSideEffect();

        return html`<div></div>`;
      }

      this.fixture = document.createElement('div');

      throws(() => {
        innerHTML(this.fixture, html`<${Component} />`)
      }, /Missing function for side effect/);
    });

    it('will support componentDidMount with empty render', async () => {
      let firedOnMount = 0;

      function Component() {
        createSideEffect(() => {
          firedOnMount++;
        });
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);

      strictEqual(firedOnMount, 1);
    });

    it('will support componentDidMount', async () => {
      let firedOnMount = 0;

      function Component() {
        createSideEffect(() => {
          firedOnMount++;
        });

        return html`<div></div>`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);

      strictEqual(firedOnMount, 1);
    });

    it('will support componentWillUnmount', async () => {
      let firedOnMount = 0;

      function Component() {
        createSideEffect(() => {
          firedOnMount++;
        });

        return html`<div></div>`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);

      strictEqual(firedOnMount, 1);
    });

    it('will support componentDidUpdate', async () => {
      let firedOnUpdate = 0;

      function Component() {
        createSideEffect(() => {
          firedOnUpdate++;
          return () => firedOnUpdate++;
        });

        return html`<div></div>`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);
      await innerHTML(this.fixture, html`<${Component} test="true" />`);

      strictEqual(firedOnUpdate, 2);
    });

    it('will support componentDidUpdate through forceUpdate', async () => {
      let firedOnUpdate = 0;

      function Component() {
        createSideEffect(() => {
          firedOnUpdate++;
          return () => firedOnUpdate++;
        });

        return html`<div></div>`;
      }

      this.fixture = document.createElement('div');

      let component = null;

      await innerHTML(this.fixture, html`<${Component} ref=${ref => (component = ref)} />`);
      await component.forceUpdate();

      strictEqual(firedOnUpdate, 2);
    });

    it('will support componentWillUnmount', async () => {
      let firedOnUnmount = 0;

      function Component() {
        createSideEffect(null, () => {
          firedOnUnmount++;
        });

        return html`<div></div>`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);
      await innerHTML(this.fixture, html``);

      strictEqual(firedOnUnmount, 1);
    });

    it('will work with createState', async () => {
      let firedOnUpdate = 0;
      let firedOnUnmount = 0;
      let setState;

      function Component() {
        const [ value, setValue ] = createState({});

        setState = setValue;

        createSideEffect(
          () => {
            firedOnUpdate++;
            return () => firedOnUpdate++;
          },

          () => {
            firedOnUnmount++;
          }
        );

        return html`<div></div>`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);
      await setState({});
      await innerHTML(this.fixture, html``);

      strictEqual(firedOnUpdate, 2);
      strictEqual(firedOnUnmount, 1);
    });
  });

  describe('createState', () => {
    it('will error when executed outside a render function', () => {
      throws(() => {
        createState();
      }, /Cannot create state unless in render function/);
    });

    it('will use an object as a default value', async () => {
      function Component() {
        const [ value ] = createState();

        return html`${JSON.stringify(value)}`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);

      strictEqual(this.fixture.outerHTML, `<div>{}</div>`);
    });

    it('will support passing a default value', async () => {
      function Component() {
        const [ value ] = createState(false);

        return html`${String(value)}`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);

      strictEqual(this.fixture.outerHTML, `<div>false</div>`);
    });

    it('will support updating the state', async () => {
      let setValue = null;

      function Component() {
        const [ value, _setValue ] = createState(false);

        setValue = _setValue;

        return html`${String(value)}`;
      }

      this.fixture = document.createElement('div');

      await innerHTML(this.fixture, html`<${Component} />`);
      await setValue(true);

      strictEqual(this.fixture.outerHTML, `<div>true</div>`);
    });
  });
});
