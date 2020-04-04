import expressJWT from "express-jwt";
import { authSecret } from "../constants";

export const authorization = [
   expressJWT({ secret: authSecret }),
   (err, req, res, next) => {
      if (err.name === "UnauthorizedError") {
         return res.status(401).send({ status: false, message: err.message });
      } else if (err) {
         next(err);
         return;
      }
      next();
   },
];
