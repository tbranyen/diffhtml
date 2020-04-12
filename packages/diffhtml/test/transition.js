import { throws, doesNotThrow } from 'assert';
import {
  addTransitionState,
  removeTransitionState,
  runTransitions,
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

    it('will error if invalid state name is passed to add in production', () => {
      process.env.NODE_ENV = 'production';
      throws(() => addTransitionState('invalid'));
    });
  });

  describe('removeTransitionState', () => {
    it('will error if invalid state name is passed to remove', () => {
      throws(() => removeTransitionState('invalid'));
    });

    it('will error if invalid state name is passed to remove', () => {
      process.env.NODE_ENV = 'production';
      throws(() => removeTransitionState('invalid'));
    });
  });
});
