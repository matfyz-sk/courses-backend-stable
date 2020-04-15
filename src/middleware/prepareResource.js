import Resource from "../resource";
import { getResourceObject } from "../helpers";

export function prepareResource(req, res, next) {
   try {
      const resource = new Resource({
         resource: getResourceObject(req.params.className),
         user: req.user,
         id: req.params.id,
      });
      res.locals.resource = resource;
      next();
   } catch (err) {
      next(err);
   }
}
