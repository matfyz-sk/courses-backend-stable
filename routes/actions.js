import { Team, Topic, Course, CourseInstance, Session, Event, Task, Agent, ReviewComment, Submission } from "../controllers";
import express from "express";
const router = express.Router();
import { requestCourseInstance } from "../controllers/actions";

router.post("/requestCourseInstance", requestCourseInstance);

export default router;
