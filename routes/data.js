import { getResourceObject, prepareClassName } from "../helpers";
import { modifyResource, getResource } from "../middleware";
import express from "express";
import Resource from "../resource";
import RequestError from "../helpers/RequestError";

const dataRouter = express.Router();

dataRouter.use("/:className", (req, res, next) => {
   const resource = getResourceObject(prepareClassName(req.params.className));
   if (!resource) {
      return next(
         new RequestError(`Resource with class name ${req.params.className} is not supported`, 400)
      );
   }
   res.locals.resource = new Resource(resource, req.user);
   next();
});

dataRouter.use("/:className/:id", async (req, res, next) => {
   if (req.method == "GET") {
      return next();
   }

   res.locals.resource.setSubject(req.params.id);
   const data = await res.locals.resource.fetch();

   if (data.length == 0) {
      return next(
         new RequestError(
            `Resource with ID ${req.params.id} and class name ${req.params.className} does not exist`,
            404
         )
      );
   }
   res.locals.resource.fill(data);
   next();
});

dataRouter.post("/:className", modifyResource);

dataRouter.get("/:className/:id?", getResource);

dataRouter.put("/:className/:id", modifyResource);

dataRouter.patch("/:className/:id", modifyResource);

dataRouter.delete("/:className/:id/:attributeName?", modifyResource);

export default dataRouter;
