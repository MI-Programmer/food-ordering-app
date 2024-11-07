import { describe, expect, it, vi } from "vitest";
import { NextFunction, Request, Response } from "express";

import catchAsync, { throwApiError } from "..";

describe("Utility Functions", () => {
  describe("catchAsync", () => {
    it("should call the next function with an error if the function throws", async () => {
      const error = new Error("Test Error");
      const asyncFunction = vi.fn().mockRejectedValue(error);
      const wrappedFunction = catchAsync(asyncFunction);
      const next = vi.fn() as NextFunction;

      await wrappedFunction({} as Request, {} as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("throwApiError", () => {
    it("should throw an error with ApiError object", () => {
      const errorData = {
        message: "API error",
        status: 404,
        details: "Not Found.",
      };

      try {
        throwApiError(errorData);
      } catch (error: any) {
        expect(error.clientMessage).toBe(errorData.message);
        expect(error.status).toBe(errorData.status);
        expect(error.details).toBe(errorData.details);
      }
    });
  });
});
