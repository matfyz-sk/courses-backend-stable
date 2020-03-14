import express from "express";
import { authSecret } from "../constants";
import expressJWT from "express-jwt";
import { AuthController } from "../controllers";

const authRouter = express.Router();

authRouter.post(
   "/register",
   AuthController.registrationValidate,
   AuthController.checkValidation,
   AuthController.emailIsFree,
   AuthController.createUser
);

authRouter.post("/login", AuthController.loginValidate, AuthController.checkValidation, AuthController.login);

authRouter.get("/github", AuthController.githubLogin);

authRouter.patch("/user", expressJWT({ secret: authSecret }), AuthController.patchUser);

export default authRouter;
