export class BaseError extends Error {
  constructor(message: string) {
    super(message);

    // Capture the correct stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
