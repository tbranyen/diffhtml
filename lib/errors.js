/**
 * Identifies an error with transitions.
 */
export class TransitionStateError extends Error {
  constructor(message) {
    super();

    this.message = message;
  }
}
