/**
 * Identifies an error with transitions.
 */
export class TransitionStateError extends Error {
  constructor(message) {
    let error = super();

    this.message = message;
    this.stack = error.stack || 'Browser doesn\'t support error stack traces.';
  }
}
