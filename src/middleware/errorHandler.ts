import { NextFunction, Request, Response } from "express";
import * as Sentry from "@sentry/node";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "UnauthorizedError") {
    res.status(403).send("invalid token...");
  } else {
    next();
  }
};

export class ErrorHandler {

 static captureException(error: Error | undefined) {
   if (process.env.NODE_ENV === "development") {
     console.log(error);
   } else {
     Sentry.captureException(error)
   }
 }

 static captureMessage(message :string) {
   if (process.env.NODE_ENV === "development") {
     console.log(message);
   } else {
     Sentry.captureMessage(message)
   }
 }

}
