import { throws } from 'assert';
import use from '../lib/use';
import validateMemory from './util/validateMemory';

describe('Use (Middleware)', function() {
  afterEach(() => validateMemory());

  it('will error if a value is passed that is not a function', () => {
    throws(() => use());
    throws(() => use(null));
    throws(() => use(undefined));
    throws(() => use(0));
    throws(() => use(NaN));
    throws(() => use(false));
    throws(() => use({}));
    throws(() => use([]));
  });
});
