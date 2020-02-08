import { PostController, GetController, PutController, PatchController, DeleteController } from "../controllers";
import express from "express";
const router = express.Router();

function prepareClassName(className) {
    return className.charAt(0).toUpperCase() + className.slice(1);
}

router.post("/:className", (req, res) => {
    PostController.storeResource(prepareClassName(req.params.className), req, res);
});

router.get("/:className/:id?", (req, res) => {
    GetController.runQuery(prepareClassName(req.params.className), req, res);
});

router.put("/:className/:id", (req, res) => {
    PutController.putResource(prepareClassName(req.params.className), req, res);
});

router.patch("/:className/:id/:attributeName", (req, res) => {
    PatchController.patchResource(prepareClassName(req.params.className), req, res);
});

router.delete("/:className/:id/:attributeName?", (req, res) => {
    DeleteController.deleteResource(prepareClassName(req.params.className), req, res);
});

export default router;
