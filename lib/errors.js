/**
 * The tran
 *
 * @class
 * @return
 */
export class TransitionStateError extends Error {
  constructor(message) {
    super();

    this.message = message;
  }
}
