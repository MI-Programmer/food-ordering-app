import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

import { jwtParse } from "../auth";
import prisma from "../../lib/prisma";

const mockRequest = () =>
  ({
    headers: { authorization: "Bearer someValidToken" },
  } as Request);
const res = {} as Response;
const next = vi.fn();

describe("Auth Middleware", () => {
  describe("jwtParse", () => {
    it("should throw an error if authorization header is missing", async () => {
      const req = mockRequest();
      req.headers.authorization = "";

      await jwtParse(req, res, next).catch((error) => {
        expect(error).toEqual(
          expect.objectContaining({
            message:
              "Unauthorized access: Missing or invalid authorization token.",
            status: 401,
          })
        );
      });
    });

    it("should throw an error if authorization header does not start with 'Bearer '", async () => {
      const req = mockRequest();
      req.headers.authorization = "InvalidTokenFormat";

      await jwtParse(req, res, next).catch((error) => {
        expect(error).toEqual(
          expect.objectContaining({
            message:
              "Unauthorized access: Missing or invalid authorization token.",
            status: 401,
          })
        );
      });
    });

    it("should throw an error if the user does not exist", async () => {
      const req = mockRequest();
      vi.spyOn(jwt, "decode").mockReturnValue({ sub: "auth0|123" });
      prisma.user.findFirst = vi.fn().mockResolvedValue(null);

      await jwtParse(req, res, next).catch((error) => {
        expect(error).toEqual(
          expect.objectContaining({
            message: "Unauthorized.",
            status: 401,
          })
        );
      });
    });

    it("should call next function if the token is valid and user exists", async () => {
      const req = mockRequest();
      vi.spyOn(jwt, "decode").mockReturnValue({ sub: "auth0|123" });
      prisma.user.findFirst = vi.fn().mockResolvedValue({ id: "userId123" });

      await jwtParse(req, res, next);

      expect(req.auth0Id).toBe("auth0|123");
      expect(req.userId).toBe("userId123");
      expect(next).toHaveBeenCalled();
    });
  });
});
