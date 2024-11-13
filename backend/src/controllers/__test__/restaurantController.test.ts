import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import prisma from "../../lib/prisma";
import {
  createRestaurant,
  getRestaurant,
  searchRestaurant,
  updateRestaurant,
} from "../restaurantController";

const mockRequest = (object: Partial<Request>) => ({ ...object } as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res;
};

const restaurantData = {
  name: "john",
  city: "jakarata",
  country: "indonesian",
  deliveryPrice: 20,
  estimatedDeliveryTime: 60,
  cuisines: ["indonesian"],
  menuItems: [{ name: "pizza", price: 20 }],
};

vi.mock("../../lib/cloudinary.ts", () => ({
  uploadImage: vi.fn().mockResolvedValue("/imageUrl"),
}));

describe("ResraurantController", () => {
  describe("getRestaurant", () => {
    it("should throw an error when restaurant is not found", async () => {
      const req = mockRequest({ userId: "1" });
      const res = {} as Response;
      prisma.restaurant.findFirst = vi.fn().mockResolvedValue(null);

      try {
        await getRestaurant(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("Restaurant not found.");
        expect(error.status).toBe(404);
      }
    });

    it("should respond with restaurant data and status when restaurant is found", async () => {
      const req = mockRequest({ userId: "1" });
      const res = mockResponse();
      const restaurant = { id: "1", name: "test" };
      prisma.restaurant.findFirst = vi.fn().mockResolvedValue(restaurant);

      await getRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(restaurant);
    });
  });

  describe("searchRestaurant", () => {
    it("should respond with filtered restaurants by cuisine", async () => {
      const req = mockRequest({
        query: { selectedCuisines: "Italian,Chinese" },
        params: {},
      });
      const res = mockResponse();
      prisma.restaurant.count = vi.fn().mockResolvedValue(2);
      prisma.restaurant.findMany = vi
        .fn()
        .mockResolvedValue([
          { name: "Italian Bistro" },
          { name: "Chinese Diner" },
        ]);

      await searchRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ name: "Italian Bistro" }, { name: "Chinese Diner" }],
        pagination: { total: 2, page: 1, pages: 1 },
      });
    });

    it("should respond with filtered results by searchQuery", async () => {
      const req = mockRequest({ query: { searchQuery: "pizza" }, params: {} });
      const res = mockResponse();
      prisma.restaurant.count = vi.fn().mockResolvedValue(1);
      prisma.restaurant.findMany = vi
        .fn()
        .mockResolvedValue([{ name: "Pizza Place" }]);

      await searchRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ name: "Pizza Place" }],
        pagination: { total: 1, page: 1, pages: 1 },
      });
    });

    it("should respond with empty data if no results found", async () => {
      const req = mockRequest({ query: {}, params: {} });
      const res = mockResponse();
      prisma.restaurant.count = vi.fn().mockResolvedValue(0);

      await searchRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [],
        pagination: { total: 0, page: 0, pages: 1 },
      });
    });

    it("should respond with paginated results", async () => {
      const req = mockRequest({ query: { page: "1" }, params: {} });
      const res = mockResponse();
      prisma.restaurant.count = vi.fn().mockResolvedValue(10);
      prisma.restaurant.findMany = vi
        .fn()
        .mockResolvedValue([{ name: "Restaurant A" }]);

      await searchRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ name: "Restaurant A" }],
        pagination: { total: 10, page: 1, pages: 1 },
      });
    });
  });

  describe("createRestaurant", () => {
    it("should throw an error when the request body validation fails", async () => {
      const req = mockRequest({ body: {} });
      const res = {} as Response;

      try {
        await createRestaurant(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("Validations failed.");
        expect(error.status).toBe(400);
        expect(error).toHaveProperty("details");
      }
    });

    it("should throw an error when the request file is nothing", async () => {
      const req = mockRequest({
        body: restaurantData,
      });
      const res = {} as Response;

      try {
        await createRestaurant(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe(
          "Invalid file type or no file uploaded."
        );
        expect(error.status).toBe(400);
      }
    });

    it("should throw an error when restaurant is exist", async () => {
      const req = mockRequest({
        body: restaurantData,
        file: true as any,
      });
      const res = mockResponse();
      prisma.restaurant.findFirst = vi.fn().mockResolvedValue({});

      try {
        await createRestaurant(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("User restaurant already exist.");
        expect(error.status).toBe(409);
      }
    });

    it("should respond with new restaurant data and status when a restaurant is created", async () => {
      const req = mockRequest({
        body: restaurantData,
        file: true as any,
      });
      const res = mockResponse();
      const restaurant = {
        id: 1,
        ...restaurantData,
      };
      prisma.restaurant.findFirst = vi.fn().mockResolvedValue(null);
      prisma.restaurant.create = vi.fn().mockResolvedValue(restaurant);

      await createRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(restaurant);
    });
  });

  describe("updateRestaurant", () => {
    it("should throw an error when the request body validation fails", async () => {
      const req = mockRequest({ body: {} });
      const res = {} as Response;

      try {
        await updateRestaurant(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("Validations failed.");
        expect(error.status).toBe(400);
        expect(error).toHaveProperty("details");
      }
    });

    it("should throw an error when restaurant is not found", async () => {
      const req = mockRequest({
        body: restaurantData,
        userId: "1",
      });
      const res = {} as Response;
      prisma.restaurant.findFirst = vi.fn().mockResolvedValue(null);

      try {
        await updateRestaurant(req, res);
      } catch (error: any) {
        expect(error.clientMessage).toBe("Restaurant not found.");
        expect(error.status).toBe(404);
      }
    });

    it("should respond with updated restaurant data and status when a restaurant is updated", async () => {
      const req = mockRequest({
        body: restaurantData,
        userId: "1",
      });
      const res = mockResponse();
      prisma.restaurant.findFirst = vi.fn().mockResolvedValue({ id: "1" });
      prisma.restaurant.update = vi
        .fn()
        .mockResolvedValue({ id: "1", ...restaurantData });

      await updateRestaurant(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: "1", ...restaurantData });
    });
  });
});
