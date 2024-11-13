import { Request, Response } from "express";
import { ZodError } from "zod";

import prisma from "../lib/prisma";
import { validateUserRequest } from "../lib/zod";
import { throwApiError } from "../utils";

const getUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (!user) {
    throwApiError({ message: "User not found.", status: 404 });
  }

  res.status(200).json(user);
};

const createUser = async (req: Request, res: Response) => {
  const { auth0Id, email } = req.body;
  const existingUser = await prisma.user.findFirst({ where: { auth0Id } });

  if (existingUser) {
    res.status(200);
    return;
  }

  const newUser = await prisma.user.create({ data: { auth0Id, email } });

  res.status(201).json(newUser);
};

const updateUser = async (req: Request, res: Response) => {
  try {
    req.body = await validateUserRequest.parseAsync(req.body);
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
    data: { ...req.body },
  });

  res.status(200).json(updatedUser);
};

export { createUser, updateUser, getUser };
