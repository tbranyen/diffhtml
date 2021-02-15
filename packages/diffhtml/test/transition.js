import { throws, doesNotThrow } from 'assert';
import {
  addTransitionState,
  removeTransitionState,
} from '../lib/transition';
import validateMemory from './util/validate-memory';

describe('Transition', function() {
  afterEach(() => {
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => validateMemory());

  describe('addTransitionState', () => {
    it('will error if invalid state name is passed to add', () => {
      throws(() => addTransitionState('invalid'));
    });

    it('will not error if invalid state name is passed to add in production', () => {
      process.env.NODE_ENV = 'production';
      doesNotThrow(() => addTransitionState('invalid'));
    });
  });

  describe('removeTransitionState', () => {
    it('will error if invalid state name is passed to remove', () => {
      throws(() => removeTransitionState('invalid'));
    });

    it('will not error if invalid state name is passed to remove in production', () => {
      process.env.NODE_ENV = 'production';
      doesNotThrow(() => removeTransitionState('invalid'));
    });
  });
});
