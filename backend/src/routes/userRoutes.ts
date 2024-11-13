import express from "express";

import { createUser, getUser, updateUser } from "../controllers/userController";
import catchAsync from "../utils";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/me", jwtCheck, jwtParse, catchAsync(getUser));
router.post("/", jwtCheck, catchAsync(createUser));
router.put("/", jwtCheck, jwtParse, catchAsync(updateUser));

export default router;
