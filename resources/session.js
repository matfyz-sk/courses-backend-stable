import express from "express";
import { createSessionValidation, createLecture, createLab } from "../controllers/session";

const router = express.Router();

router.post("/lecture", createSessionValidation, createLecture);
router.post("/lab", createSessionValidation, createLab);

exports.sessionsRouter = router;
