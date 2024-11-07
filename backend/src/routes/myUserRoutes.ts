import express from "express";

import {
  createCurrentUser,
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/myUserController";
import catchAsync from "../utils";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, catchAsync(getCurrentUser));
router.post("/", jwtCheck, catchAsync(createCurrentUser));
router.put("/", jwtCheck, jwtParse, catchAsync(updateCurrentUser));

export default router;
