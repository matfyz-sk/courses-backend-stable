import { createResource, modifyResource, getResource } from "../middleware";
import express from "express";

const dataRouter = express.Router();

dataRouter.post("/:className", createResource);
dataRouter.put("/:className/:id", modifyResource);
dataRouter.patch("/:className/:id", modifyResource);
dataRouter.delete("/:className/:id/:attributeName?", modifyResource);
dataRouter.get("/:className/:id?", getResource);

export default dataRouter;
