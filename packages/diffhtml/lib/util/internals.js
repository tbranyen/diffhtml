import * as caches from './caches';
import decodeEntities from './decode-entities';
import escape from './escape';
import makeMeasure from './make-measure';
import * as memory from './memory';
import Pool from './pool';
import process from './process';

export default Object.assign({
  decodeEntities,
  escape,
  makeMeasure,
  memory,
  Pool,
  process,
}, caches);
