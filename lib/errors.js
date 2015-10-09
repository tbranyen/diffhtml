var missingStackTrace = 'Browser doesn\'t support error stack traces.';

/**
 * Identifies an error with transitions.
 */
export class TransitionStateError extends Error {
  constructor(message) {
    let error = super();

    this.message = message;
    this.stack = error.stack || missingStackTrace;
  }
}

/**
 * Identifies an error with registering an element.
 */
export class DOMException extends Error {
  constructor(message) {
    let error = super();

    this.message = 'Uncaught DOMException: ' + message;
    this.stack = error.stack || missingStackTrace;
  }
}
