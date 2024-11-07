import { Request, Response } from "express";
import { ZodError } from "zod";

import prisma from "../lib/prisma";
import { validateMyUserRequest } from "../lib/zod";
import { throwApiError } from "../utils";

const getCurrentUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (!user) {
    throwApiError({ message: "User not found.", status: 404 });
  }

  res.status(200).json(user);
};

const createCurrentUser = async (req: Request, res: Response) => {
  const { auth0Id, email } = req.body;
  const existingUser = await prisma.user.findFirst({ where: { auth0Id } });

  if (existingUser) {
    throwApiError({
      message: `Email "${email}" is already exist. Please use a different email.`,
      status: 409,
    });
  }

  const newUser = await prisma.user.create({ data: { auth0Id, email } });

  res.status(201).json(newUser);
};

const updateCurrentUser = async (req: Request, res: Response) => {
  const { name, addressLine1, country, city } = req.body;

  try {
    await validateMyUserRequest.parseAsync({
      name,
      addressLine1,
      country,
      city,
    });
  } catch (errors) {
    const details = errors instanceof ZodError ? { details: errors } : {};
    throwApiError({
      message: "Validations failed.",
      status: 400,
      ...details,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: req.userId },
  });
  if (!existingUser) {
    throwApiError({ message: "User not found.", status: 404 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.userId },
    data: { name, addressLine1, country, city },
  });

  res.status(200).json(updatedUser);
};

export { createCurrentUser, updateCurrentUser, getCurrentUser };
