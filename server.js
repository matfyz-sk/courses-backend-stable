import express from "express";
import bodyParser from "body-parser";
import router from "./routes/data";
import authRouter from "./routes/auth";
import { authSecret } from "./constants";
var expressJWT = require("express-jwt");

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/data", /*expressJWT({ secret: authSecret }),*/ router);
app.use("/auth", authRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
