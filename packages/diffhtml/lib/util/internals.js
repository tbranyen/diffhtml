import * as caches from './caches';
import decodeEntities from './decode-entities';
import escape from './escape';
import makeMeasure from './make-measure';
import * as memory from './memory';
import Pool from './pool';
import process from './process';
import * as svg from './svg';

const root = typeof global !== 'undefined' ? global : window;

const internals = root[Symbol.for('diff.shared-internals')] = Object.assign({
  decodeEntities,
  escape,
  makeMeasure,
  memory,
  Pool,
  process,
  svg,
}, caches);

export default internals;
