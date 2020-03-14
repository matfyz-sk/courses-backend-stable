import express from "express";
import bodyParser from "body-parser";
import dataRouter from "./routes/data";
import authRouter from "./routes/auth";
import { authSecret } from "./constants";
import expressJWT from "express-jwt";
import cors from "cors";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
   cors({
      origin: "*"
   })
);

app.use(
   "/data",
   expressJWT({ secret: authSecret }),
   (err, req, res, next) => {
      if (err.name === "UnauthorizedError") {
         res.status(401).send({ message: err.message });
         return;
      }
      next();
   },
   dataRouter
);

app.use("/auth", authRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
