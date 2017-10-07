import * as caches from './caches';
import decodeEntities from './decode-entities';
import escape from './escape';
import makeMeasure from './make-measure';
import * as memory from './memory';
import Pool from './pool';
import process from './process';

const { assign } = Object;

export default assign({
  decodeEntities,
  escape,
  makeMeasure,
  memory,
  Pool,
  process,
}, caches);
