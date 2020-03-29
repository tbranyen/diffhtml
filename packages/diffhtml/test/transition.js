import { throws, doesNotThrow } from 'assert';
import { removeTransitionState } from '../lib/transition';
import validateMemory from './util/validate-memory';

describe('Transition', function() {
  afterEach(() => validateMemory());

  describe('removeTransitionState', () => {
    it('will error if invalid state name is passed to remove', () => {
      doesNotThrow(() => removeTransitionState());
      throws(() => removeTransitionState('invalid'));
    });
  });
});
