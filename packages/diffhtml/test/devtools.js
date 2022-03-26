import { createRequire } from 'module';
import { ok } from 'assert';
import globalThis from '../lib/util/global';
import validateMemory from './util/validate-memory';

const require = createRequire(import.meta.url);

describe('DevTools', function() {
  afterEach(() => validateMemory());

  after(async () => {
    // Restore global state.
    delete global[Symbol.for('diffHTML')];
    await import('../lib/index?' + Date.now());
  });

  it('will not hook into devtools with primary build if devtools are not present', async () => {
    delete global[Symbol.for('diffHTML')];
    await import('../lib/index?' + Date.now());
    delete global[Symbol.for('diffHTML')];
  });

  it('will not hook into devtools with lite build if devtools are not present', async () => {
    delete global[Symbol.for('diffHTML')];
    await import('../lib/lite?' + Date.now());
    delete global[Symbol.for('diffHTML')];
  });

  it('will hook into devtools with primary build', async () => {
    let hooked = null;
    delete global[Symbol.for('diffHTML')];

    const middleware = () => {};

    globalThis.devTools = Internals => {
      hooked = Internals;
      return middleware;
    };

    await import('../lib/index?' + Date.now());

    ok(hooked);
    delete globalThis.devTools;
    delete global[Symbol.for('diffHTML')];
    global.unsubscribeDevTools();
  });

  it('will hook into devtools with lite build', async () => {
    let hooked = null;
    delete global[Symbol.for('diffHTML')];

    const middleware = () => {};

    globalThis.devTools = Internals => {
      hooked = Internals;
      return middleware;
    };

    await import('../lib/lite?' + Date.now());

    ok(hooked);
    delete globalThis.devTools;
    delete global[Symbol.for('diffHTML')];
    global.unsubscribeDevTools();
  });
});
