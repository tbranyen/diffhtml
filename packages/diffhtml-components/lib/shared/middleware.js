import onceEnded from './once-ended';
import * as hooks from './hooks';

const { assign } = Object;

export default () => assign(
  transaction => transaction.onceEnded(onceEnded),
  hooks,
  {
    displayName: 'componentTask',
  },
);
