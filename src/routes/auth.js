import { login, register, githubLogin } from "../middleware";
import express from "express";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/github", githubLogin);

export default authRouter;
