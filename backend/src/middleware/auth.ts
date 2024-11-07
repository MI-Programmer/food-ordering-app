import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";

import catchAsync, { throwApiError } from "../utils";
import prisma from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

const jwtParse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throwApiError({
        message: "Unauthorized access: Missing or invalid authorization token.",
        status: 401,
      });
    }

    const token = authorization!.split(" ")[1];
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await prisma.user.findFirst({ where: { auth0Id } });
    if (!user) {
      throwApiError({ message: "Unauthorized.", status: 401 });
    }

    req.auth0Id = auth0Id!;
    req.userId = user!.id;
    next();
  }
);

export { jwtParse, jwtCheck };
