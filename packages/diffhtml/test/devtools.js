import { ok } from 'assert';
import globalThis from '../lib/util/global';
import validateMemory from './util/validate-memory';

describe('DevTools', function() {
  afterEach(() => validateMemory());

  it('will not hook into devtools with primary build if devtools are not present', () => {
    delete require.cache[require.resolve('../lib/index')];
    require('../lib/index');
    delete require.cache[require.resolve('../lib/index')];
  });

  it('will not hook into devtools with runtime build if devtools are not present', () => {
    delete require.cache[require.resolve('../lib/runtime')];
    require('../lib/runtime');
    delete require.cache[require.resolve('../lib/runtime')];
  });

  it('will hook into devtools with primary build', () => {
    let hooked = null;
    delete require.cache[require.resolve('../lib/index')];

    const middleware = () => {};

    globalThis.devTools = Internals => {
      hooked = Internals;
      return middleware;
    };

    require('../lib/index');

    ok(hooked);
    delete globalThis.devTools;
    delete require.cache[require.resolve('../lib/index')];
    global.unsubscribeDevTools();
  });

  it('will hook into devtools with runtime build', () => {
    let hooked = null;
    delete require.cache[require.resolve('../lib/runtime')];

    const middleware = () => {};

    globalThis.devTools = Internals => {
      hooked = Internals;
      return middleware;
    };

    require('../lib/runtime');

    ok(hooked);
    delete globalThis.devTools;
    delete require.cache[require.resolve('../lib/index')];
    global.unsubscribeDevTools();
  });
});
