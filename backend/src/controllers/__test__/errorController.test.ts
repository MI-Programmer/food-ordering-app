import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { handleError } from "../errorController";
import { ApiError } from "../../utils";

const req = {} as Request;
const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res;
};
const next = () => {};

describe("ErrorController", () => {
  describe("handleError", () => {
    it("should respond with custom client message and status", () => {
      const error = { clientMessage: "Not Found", status: 404 } as ApiError;
      const res = mockResponse();

      handleError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(error.status);
      expect(res.json).toHaveBeenCalledWith({ message: error.clientMessage });
    });

    it("should use default message and status if not provided", () => {
      const error = {} as ApiError;
      const res = mockResponse();

      handleError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should include error details if available", () => {
      const res = mockResponse();
      const error = {
        clientMessage: "Validation Error",
        status: 400,
        details: { field: "email" },
      } as ApiError;

      handleError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(error.status);
      expect(res.json).toHaveBeenCalledWith({
        message: error.clientMessage,
        details: error.details,
      });
    });
  });
});
