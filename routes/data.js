import { getResourceObject } from "../helpers";
import { modifyResource, getResource } from "../middleware";
import express from "express";
import Resource from "../resource";

const dataRouter = express.Router();

dataRouter.use("/:className/:id?", async (req, res, next) => {
   try {
      const resourceObject = getResourceObject(req.params.className);
      const resource = new Resource({
         resource: resourceObject,
         user: req.user,
         id: req.params.id,
      });
      res.locals.resource = resource;
      if (req.method == "GET" || req.params.id == undefined) {
         return next();
      }
      await resource.fetch();
   } catch (err) {
      return next(err);
   }
   next();
});

dataRouter.post("/:className", modifyResource);
dataRouter.put("/:className/:id", modifyResource);
dataRouter.patch("/:className/:id", modifyResource);
dataRouter.delete("/:className/:id/:attributeName?", modifyResource);
dataRouter.get("/:className/:id?", getResource);

export default dataRouter;
