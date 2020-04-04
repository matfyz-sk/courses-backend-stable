import RequestError from "../helpers/RequestError";
import { DataController } from "../controllers";

export async function getResource(req, res, next) {
   if (Object.keys(req.query).length == 0 && req.params.id == undefined && !req.user.superAdmin) {
      return next(new RequestError("Request is not allowed", 401));
   }
   if (req.params.id) {
      req.query["id"] = req.params.id;
   }
   const data = await DataController.getResource(res.locals.resource.resource, req.query);
   res.status(200).send(data);
}
