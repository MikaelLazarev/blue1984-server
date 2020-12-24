import * as Sentry from "@sentry/node";


export class ErrorHandler {
  static captureException(error: Error | undefined) {
    console.log(error);
    if (process.env.NODE_ENV !== "development") {
      Sentry.captureException(error);
    }
  }

  static captureMessage(message: string) {
    console.log(message);
    if (process.env.NODE_ENV !== "development") {
      Sentry.captureMessage(message);
    }
  }
}
