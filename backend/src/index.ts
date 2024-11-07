import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import myUserRoutes from "./routes/myUserRoutes";
import { handleError } from "./controllers/errorController";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/my/user", myUserRoutes);

app.use(handleError);

app.listen(8000, () => {
  console.log("server started on localhost:8000");
});
