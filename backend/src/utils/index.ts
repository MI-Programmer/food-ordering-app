import { NextFunction, Request, Response } from "express";

type FunctionController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

interface ApiError extends Error {
  status?: number;
  details?: any;
  clientMessage?: string;
}

interface throwApiError {
  status?: number;
  details?: any;
  message?: string;
}

const catchAsync = (func: FunctionController) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};

const throwApiError = ({ message, status, details }: throwApiError) => {
  throw Object.assign(new Error(""), {
    clientMessage: message,
    status,
    details,
  }) as ApiError;
};

export { ApiError, throwApiError };

export default catchAsync;
