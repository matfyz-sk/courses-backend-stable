import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import chalk from "chalk";
import dataRouter from "./routes/data";
import authRouter from "./routes/auth";
import { errorHandler, authorization } from "./middleware";
import { dateTime } from "./helpers";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
   console.log(chalk.green(`[${dateTime()}]`), chalk.yellow(req.method), req.originalUrl);
   console.log(chalk.black.bgWhite("Request headers:"));
   console.log(JSON.stringify(req.headers, null, 2));
   console.log(chalk.black.bgWhite("Request body:"));
   console.log(JSON.stringify(req.body, null, 2));
   next();
});
app.use("/data", authorization, dataRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(port, () =>
   console.log(chalk.green(`[${dateTime()}]`), `Server running on port ${port}`)
);
