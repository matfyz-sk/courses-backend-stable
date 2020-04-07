import { getResourceObject } from "../helpers";
import { modifyResource, getResource } from "../middleware";
import express from "express";
import Resource from "../resource";
import RequestError from "../helpers/RequestError";

const dataRouter = express.Router();

dataRouter.use("/:className/:id?", async (req, res, next) => {
   const resourceObject = getResourceObject(req.params.className);
   if (!resourceObject) {
      return next(
         new RequestError(`Resource with class name ${req.params.className} is not supported`, 400)
      );
   }
   const resource = new Resource(resourceObject, req.user);
   res.locals.resource = resource;
   if (req.method == "GET" || req.params.id == undefined) {
      return next();
   }
   resource.setSubject(req.params.id);
   const data = await resource.fetch();
   if (data.length == 0) {
      return next(
         new RequestError(
            `Resource with ID ${req.params.id} and class name ${req.params.className} does not exist`,
            404
         )
      );
   }
   resource.fill(data);
   next();
});

dataRouter.post("/:className", modifyResource);
dataRouter.put("/:className/:id", modifyResource);
dataRouter.patch("/:className/:id", modifyResource);
dataRouter.delete("/:className/:id/:attributeName?", modifyResource);
dataRouter.get("/:className/:id?", getResource);

export default dataRouter;
