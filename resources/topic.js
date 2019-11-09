import express from "express";
import { getAllTopics, createTopic, getTopic, deleteTopic, patchTopic, putTopic, createTopicValidation } from "../controllers/topic";

const router = express.Router();

router.post("/", createTopicValidation, createTopic);
router.get("/", getAllTopics);
router.get("/:id", getTopic);
router.delete("/:id", deleteTopic);
router.patch("/:id", patchTopic);
router.put("/:id", putTopic);

exports.topicsRouter = router;
