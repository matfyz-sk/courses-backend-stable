import { PostController, GetController, PutController, PatchController, DeleteController } from "../controllers";
import { getResourceObject, prepareClassName } from "../helpers";
import express from "express";
const router = express.Router();
import Resource from "../model/Resource";

router.use("/:className", (req, res, next) => {
    const resource = getResourceObject(prepareClassName(req.params.className));
    if (!resource) {
        return res.status(400).send({ status: false, msg: `Resource with class name ${req.params.className} is not supported` });
    }
    res.locals.resource = new Resource(resource);
    next();
});

router.use("/:className/:id", (req, res, next) => {
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

router.post("/:className", (req, res) => {
    PostController.storeResource(req, res);
});

router.get("/:className/:id?", (req, res) => {
    GetController.runQuery(req, res);
});

router.put("/:className/:id", (req, res) => {
    PutController.putResource(req, res);
});

router.patch("/:className/:id", (req, res) => {
    PatchController.patchResource(req, res);
});

router.delete("/:className/:id/:attributeName", (req, res) => {
    DeleteController.deleteResource(req, res);
});

export default router;
