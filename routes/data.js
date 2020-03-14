import { PostController, GetController, PutController, PatchController, DeleteController } from "../controllers";
import { getResourceObject, prepareClassName } from "../helpers";
import express from "express";
const dataRouter = express.Router();
import Resource from "../model/Resource";

dataRouter.use("/:className", (req, res, next) => {
  const resource = getResourceObject(prepareClassName(req.params.className));
  if (!resource) {
    return res.status(400).send({ status: false, msg: `Resource with class name ${req.params.className} is not supported` });
  }
  res.locals.resource = new Resource(resource);
  next();
});

dataRouter.use("/:className/:id", (req, res, next) => {
  res.locals.resource.setSubject(req.params.id);
  res.locals.resource
    .fetch()
    .then(data => {
      if (data.results.bindings.length == 0) {
        return res.status(404).send({
          status: false,
          msg: `Resource with ID ${req.params.id} and class name ${req.params.className} does not exist`
        });
      }
      res.locals.resource.fill(data);
      next();
    })
    .catch(err => res.status(500).send({ status: false, msg: err }));
});

dataRouter.post("/:className", PostController.storeResource);

dataRouter.get("/:className/:id?", GetController.runQuery);

dataRouter.put("/:className/:id", PutController.putResource);

dataRouter.patch("/:className/:id", PatchController.patchResource);

dataRouter.delete("/:className/:id/:attributeName?", DeleteController.deleteResource);

export default dataRouter;
