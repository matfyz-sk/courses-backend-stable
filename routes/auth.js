import express from "express";

import { authSecret } from "../constants";
import { body } from "express-validator";
import expressJWT from "express-jwt";
import { AuthController } from "../controllers";

const authRouter = express.Router();

authRouter.post(
   "/register",
   [
      body("user").exists(),
      body("user.first_name")
         .exists()
         .isString(),
      body("user.last_name")
         .exists()
         .isString(),
      body("user.email")
         .exists()
         .isEmail(),
      body("user.password")
         .exists()
         .isString(),
      body("privacy").exists(),
      body("privacy.use_nickname")
         .exists()
         .isBoolean(),
      body("privacy.public_profile")
         .exists()
         .isBoolean(),
      body("privacy.show_courses")
         .exists()
         .isBoolean(),
      body("privacy.show_badges")
         .exists()
         .isBoolean(),
      body("privacy.allow_contact")
         .exists()
         .isBoolean(),
      body("privacy.nickname")
         .if(body("privacy.use_nickname").custom(value => value === true))
         .exists()
         .isString()
   ],
   AuthController.checkValidation,
   AuthController.emailIsFree,
   AuthController.createUser
);

authRouter.post("/login", [body("email").exists(), body("password").exists()], AuthController.checkValidation, AuthController.login);

authRouter.get("/github", AuthController.githubLogin);

authRouter.patch("/user", expressJWT({ secret: authSecret }), AuthController.patchUser);

export default authRouter;
