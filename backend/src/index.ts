import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import { handleError } from "./controllers/errorController";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);

app.use(handleError);

app.listen(8000, () => {
  console.log("server started on localhost:8000");
});
