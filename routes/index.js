import { PostController, GetController, PutController, PatchController, DeleteController } from "../controllers";
import { getResourceObject, prepareClassName } from "../helpers";
import express from "express";
const router = express.Router();

router.use("/:className", (req, res, next) => {
    console.log("router use middleware /:className ");
    const resource = getResourceObject(prepareClassName(req.params.className));
    if (!resource) {
        res.status(400).send("not implemented");
        return;
    }
    res.locals.resource = resource;
    next();
});

router.use("/:className/:id", (req, res, next) => {
    res.locals.resource.id = req.params.id;
    res.locals.resource
        .fetch()
        .then(data => {
            if (data.results.bindings.length == 0) {
                res.status(404).send("Resource does not exist");
                return;
            }
            res.locals.resource._fill(data);
            next();
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
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

router.patch("/:className/:id/:attributeName", (req, res) => {
    PatchController.patchResource(req, res);
});

router.delete("/:className/:id/:attributeName?", (req, res) => {
    DeleteController.deleteResource(req, res);
});

export default router;
