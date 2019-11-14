import { User, Team, Topic, Course, CourseInstance, Session } from "../controllers";

import express from "express";
const router = express.Router();

router.post("/user", User.createUserValidation, User.createUser);
router.get("/user", User.getAllUsers);
router.get("/user/:id", User.idValidation, User.getUser);
router.post("/user/requestCourseInstance", User.requestCourseInstanceValidation, User.requestCourseInstance);
router.post("/user/setCourseInstance", User.requestCourseInstanceValidation, User.setCourseInstance);
router.delete("/user/:id", async (req, res) => {});

router.post("/topic", Topic.createTopicValidation, Topic.createTopic);
router.get("/topic", Topic.getAllTopics);
router.get("/topic/:id", Topic.getTopic);
router.delete("/topic/:id", Topic.deleteTopic);
router.patch("/topic/:id", Topic.patchTopic);
router.put("/topic/:id", Topic.putTopic);

router.post("/team", Team.createTeamValidation, Team.createTeam);
router.get("/team", Team.getAllTeams);
router.get("/team/:id", Team.getTeam);

router.post("/session/lecture", Session.createSessionValidation, Session.createLecture);
router.post("/session/lab", Session.createSessionValidation, Session.createLab);

router.post("/courseInstance", CourseInstance.createCourseInstance);
router.get("/courseInstance", CourseInstance.getCourseInstance);

router.post("/course", Course.createCourse);
router.get("/course", Course.getAllCourses);
router.get("/course/:id", Course.getCourse);

export default router;
