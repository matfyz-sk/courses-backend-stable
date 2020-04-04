import express from "express";
import bodyParser from "body-parser";
import dataRouter from "./routes/data";
import authRouter from "./routes/auth";

import cors from "cors";
import { errorHandler, authorization } from "./middleware";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
   cors({
      origin: "*",
   })
);

app.use(
   "/data",
   authorization,
   (req, res, next) => {
      req.user.admin = true;
      req.user.superAdmin = true;
      next();
   },
   dataRouter
);

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
