import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chalk from "chalk";
import dataRouter from "./routes/data";
import authRouter from "./routes/auth";
import { errorHandler, authorization } from "./middleware";
import { dateTime } from "./helpers";
import { logger } from "./middleware/logger";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger);
app.use("/data", authorization, dataRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(port, () =>
   console.log(chalk.green(`[${dateTime()}]`), `Server running on port ${port}`)
);
