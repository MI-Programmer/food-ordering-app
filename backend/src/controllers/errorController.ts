import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils";

const handleError = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    clientMessage = "Internal Server Error",
    status = 500,
    details,
  } = error;

  console.error("Unhandled Error:", error);
  res.status(status).json({
    message: clientMessage,
    ...(details ? { details } : {}),
  });
};

export { handleError };
