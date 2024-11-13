import express from "express";

import {
  createRestaurant,
  getRestaurant,
  searchRestaurant,
  updateRestaurant,
} from "../controllers/restaurantController";
import catchAsync from "../utils";
import { jwtCheck, jwtParse } from "../middleware/auth";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, catchAsync(getRestaurant));

router.get("/search/:city", catchAsync(searchRestaurant));

router.post(
  "/",
  upload.single("image"),
  jwtCheck,
  jwtParse,
  catchAsync(createRestaurant)
);

router.put(
  "/",
  upload.single("image"),
  jwtCheck,
  jwtParse,
  catchAsync(updateRestaurant)
);

export default router;
