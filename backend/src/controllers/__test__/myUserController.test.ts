import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import prisma from "../../lib/prisma";
import {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
} from "../myUserController";

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res;
};

describe("MyUserController", () => {
  describe("getCurrentUser", () => {
    it("should throw an error when user is not found", async () => {
      const req = { userId: 1 } as unknown as Request;
      const res = {} as Response;
      prisma.user.findUnique = vi.fn().mockResolvedValue(null);

      try {
        await getCurrentUser(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("User not found.");
        expect(error.status).toBe(404);
      }
    });

    it("should respond with user data and status when user is found", async () => {
      const req = { userId: 1 } as unknown as Request;
      const res = mockResponse();
      const user = { id: 1, name: "test", email: "test@example.com" };
      prisma.user.findUnique = vi.fn().mockResolvedValue(user);

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("createCurrentUser", () => {
    it("should throw an error when user is exist", async () => {
      const req = {
        body: {
          auth0Id: "google-oauth2|109333",
          email: "test@example.com",
        },
      } as unknown as Request;
      const res = {} as Response;
      const user = { id: 1, name: "test", email: "test@example.com" };
      prisma.user.findFirst = vi.fn().mockResolvedValue(user);

      try {
        await createCurrentUser(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe(
          `Email "${user.email}" is already exist. Please use a different email.`
        );
        expect(error.status).toBe(409);
      }
    });

    it("should respond with new user data and status when a user is created", async () => {
      const req = {
        body: {
          auth0Id: "google-oauth2|109333",
          email: "test@example.com",
        },
      } as unknown as Request;
      const res = mockResponse();
      const user = {
        id: 1,
        name: "test",
        email: "test@example.com",
        auth0Id: "google-oauth2|109333",
      };
      prisma.user.findFirst = vi.fn().mockResolvedValue(null);
      prisma.user.create = vi.fn().mockResolvedValue(user);

      await createCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("updateCurrentUser", () => {
    it("should throw an error when the request body validation fails", async () => {
      const req = { body: {} } as unknown as Request;
      const res = {} as Response;

      try {
        await updateCurrentUser(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("Validations failed.");
        expect(error.status).toBe(400);
        expect(error).toHaveProperty("details");
      }
    });

    it("should throw an error when user is not found", async () => {
      const req = {
        body: {
          name: "test",
          addressLine1: "test",
          country: "test",
          city: "test",
        },
        userId: 1,
      } as unknown as Request;
      const res = {} as Response;
      prisma.user.findUnique = vi.fn().mockResolvedValue(null);

      try {
        await updateCurrentUser(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("User not found.");
        expect(error.status).toBe(404);
      }
    });

    it("should respond with updated user data and status when a user is updated", async () => {
      const req = {
        body: {
          name: "test",
          addressLine1: "test",
          country: "test",
          city: "test",
        },
        userId: 1,
      } as unknown as Request;
      const res = mockResponse();
      const user = {
        id: 1,
        name: "test",
        email: "test@example.com",
        auth0Id: "google-oauth2|109333",
      };
      prisma.user.findUnique = vi.fn().mockResolvedValue({});
      prisma.user.update = vi
        .fn()
        .mockImplementation(async ({ data }) => ({ ...data, ...user }));

      await updateCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...req.body, ...user });
    });
  });
});