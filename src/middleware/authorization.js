import expressJWT from "express-jwt";
import { authSecret } from "../constants";

export const authorization = [
   expressJWT({ secret: authSecret }),
   (req, res, next) => {
      req.user.admin = true;
      req.user.superAdmin = true;
      next();
   },
];
