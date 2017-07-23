import { use } from 'diffhtml';
import lifecycleHooks from './lifecycle-hooks';
import setState from './set-state';
import forceUpdate from './force-update';
import componentTask from './middleware';
import { $$render } from '../util/symbols';
import { ComponentTreeCache, InstanceCache } from '../util/caches';

const { assign } = Object;

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
let unsubscribe = null;

export default function upgradeClass(Constructor) {
  Constructor.subscribeMiddleware = options => {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = use(componentTask(options));
  };

  Constructor.unsubscribeMiddleware = () => {
    unsubscribe();
    ComponentTreeCache.clear();
    InstanceCache.clear();
  };

  // Registers a custom middleware to help map the diffHTML render lifecycle
  // internals to React-like & Custom Element components.
  assign(Constructor.prototype, lifecycleHooks, {
    forceUpdate() {
      this[$$render]();
    },

    setState,
    forceUpdate,
  });

  // Automatically subscribe the React Component middleware.
  Constructor.subscribeMiddleware();

  return Constructor;
}
