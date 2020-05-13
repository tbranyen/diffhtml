import { ok } from 'assert';
import globalThis from '../lib/util/global';
import validateMemory from './util/validate-memory';

describe('DevTools', function() {
  afterEach(() => validateMemory());

  it('will not hook into devtools with primary build if devtools are not present', () => {
    delete require.cache[require.resolve('../lib/index')];
    delete global[Symbol.for('diffHTML')];
    require('../lib/index');
    delete require.cache[require.resolve('../lib/index')];
    delete global[Symbol.for('diffHTML')];
  });

  it('will not hook into devtools with runtime build if devtools are not present', () => {
    delete require.cache[require.resolve('../lib/runtime')];
    delete global[Symbol.for('diffHTML')];
    require('../lib/runtime');
    delete require.cache[require.resolve('../lib/runtime')];
    delete global[Symbol.for('diffHTML')];
  });

  it('will hook into devtools with primary build', () => {
    let hooked = null;
    delete require.cache[require.resolve('../lib/index')];
    delete global[Symbol.for('diffHTML')];

    const middleware = () => {};

    globalThis.devTools = Internals => {
      hooked = Internals;
      return middleware;
    };

    require('../lib/index');

    ok(hooked);
    delete globalThis.devTools;
    delete require.cache[require.resolve('../lib/index')];
    delete global[Symbol.for('diffHTML')];
    global.unsubscribeDevTools();
  });

  it('will hook into devtools with runtime build', () => {
    let hooked = null;
    delete require.cache[require.resolve('../lib/runtime')];
    delete global[Symbol.for('diffHTML')];

    const middleware = () => {};

    globalThis.devTools = Internals => {
      hooked = Internals;
      return middleware;
    };

    require('../lib/runtime');

    ok(hooked);
    delete globalThis.devTools;
    delete require.cache[require.resolve('../lib/index')];
    delete global[Symbol.for('diffHTML')];
    global.unsubscribeDevTools();
  });
});
