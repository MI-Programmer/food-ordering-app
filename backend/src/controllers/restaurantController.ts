import { Request, Response } from "express";
import { ZodError } from "zod";
import { Restaurant } from "@prisma/client";

import { throwApiError } from "../utils";
import prisma from "../lib/prisma";
import { uploadImage } from "../lib/cloudinary";
import { validateRestaurantRequest } from "../lib/zod";

const PAGE_SIZE = 10;

const getRestaurant = async (req: Request, res: Response) => {
  const restaurant = await prisma.restaurant.findFirst({
    where: { userId: req.userId },
  });

  if (!restaurant) {
    throwApiError({ message: "Restaurant not found.", status: 404 });
  }

  res.status(200).json(restaurant);
};

const searchRestaurant = async (req: Request, res: Response) => {
  const { city } = req.params;
  const searchQuery = (req.query.searchQuery as string) || "";
  const selectedCuisines = (req.query.selectedCuisines as string) || "";
  const sortOption = (req.query.sortOption as string) || "lastUpdated";
  const page = +(req.query.page as string) || 1;

  const filter: any = {
    city: { contains: city, mode: "insensitive" },
  };

  if (selectedCuisines) {
    const cuisinesArray = selectedCuisines.split(",");
    filter.cuisines = { hasEvery: cuisinesArray };
  }

  if (searchQuery) {
    filter.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { cuisines: { has: searchQuery } },
    ];
  }

  const total = await prisma.restaurant.count({ where: filter });

  const response = {
    data: [] as Restaurant[],
    pagination: {
      total,
      page,
      pages: Math.ceil(total / PAGE_SIZE),
    },
  };

  if (total === 0) {
    response.pagination.page = 0;
    response.pagination.pages = 1;
  } else {
    const restaurants = await prisma.restaurant.findMany({
      where: filter,
      orderBy: { [sortOption]: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    response.data = restaurants;
  }

  res.status(200).json(response);
};

const createRestaurant = async (req: Request, res: Response) => {
  try {
    req.body = await validateRestaurantRequest.parseAsync(req.body);
  } catch (errors) {
    const details = errors instanceof ZodError ? { details: errors } : {};
    throwApiError({
      message: "Validations failed.",
      status: 400,
      ...details,
    });
  }

  if (!req.file) {
    throwApiError({
      message: "Invalid file type or no file uploaded.",
      status: 400,
    });
  }

  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { userId: req.userId },
  });

  if (existingRestaurant) {
    throwApiError({ message: "User restaurant already exist.", status: 409 });
  }

  const imageUrl = await uploadImage(req.file!, "restaurants");
  const restaurant = await prisma.restaurant.create({
    data: { userId: req.userId, imageUrl, ...req.body },
  });

  res.status(201).json(restaurant);
};

const updateRestaurant = async (req: Request, res: Response) => {
  try {
    req.body = await validateRestaurantRequest.parseAsync(req.body);
  } catch (errors) {
    const details = errors instanceof ZodError ? { details: errors } : {};
    throwApiError({
      message: "Validations failed.",
      status: 400,
      ...details,
    });
  }

  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { userId: req.userId },
  });

  if (!existingRestaurant) {
    throwApiError({ message: "Restaurant not found.", status: 404 });
  }

  if (req.file) {
    req.body.imageUrl = await uploadImage(req.file, "restaurants");
  }

  const restaurant = await prisma.restaurant.update({
    where: { id: existingRestaurant!.id },
    data: { ...req.body },
  });

  res.status(200).json(restaurant);
};

export { getRestaurant, searchRestaurant, createRestaurant, updateRestaurant };
