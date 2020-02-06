import { PostController, GetController, PutController, PatchController, DeleteController } from "../controllers";
import express from "express";
const router = express.Router();

function prepareFunctionName(requestType, className) {
    return requestType + className.charAt(0).toUpperCase() + className.slice(1);
}

function runRequestFunction(controller, functionName, req, res) {
    if (!controller[functionName]) {
        res.status(400).send("not implemented");
        return;
    }
    controller[functionName](req, res);
}

router.post("/:className", (req, res) => {
    runRequestFunction(PostController.default, prepareFunctionName("create", req.params.className), req, res);
});

router.get("/:className/:id?", (req, res) => {
    runRequestFunction(GetController, prepareFunctionName("get", req.params.className), req, res);
});

router.put("/:className/:id", (req, res) => {
    runRequestFunction(PutController, prepareFunctionName("put", req.params.className), req, res);
});

router.patch("/:className/:id/:attributeName", (req, res) => {
    runRequestFunction(PatchController, prepareFunctionName("patch", req.params.className), req, res);
});

router.delete("/:className/:id/:attributeName?", (req, res) => {
    runRequestFunction(DeleteController, prepareFunctionName("delete", req.params.className), req, res);
});

export default router;
