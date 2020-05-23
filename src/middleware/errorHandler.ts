import { NextFunction, Request, Response } from "express";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  }
};
