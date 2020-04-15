import { validationResult } from "express-validator";

export function checkValidation(req, res, next) {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(200).json({ status: false, msg: "Fill required attributes!", user: null });
   }
   next();
}
