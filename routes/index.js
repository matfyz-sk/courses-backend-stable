import { User, Team, Topic, Course, CourseInstance, Session, Event, Task, Agent, ReviewComment, Submission } from "../controllers";
import express from "express";
import { validationResult } from "express-validator";
import * as Validators from "../constants/requestValidators";
const router = express.Router();

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else next();
}

router.post("/user", Validators.createUser, Agent.createUser);
router.delete("/user/:id", Agent.deleteUser);
router.patch("/user/:id", Agent.patchUser);

router.post("/team", Validators.createTeam, Agent.createTeam);
router.delete("/team/:id", Agent.deleteTeam);
router.patch("/team/:id", Agent.patchTeam);

router.get("/user", Agent.getAllUsers);
router.get("/user/:id", Agent.getUser);
router.get("/course", Course.getAllCourses);
router.get("/course/:id", Course.getCourse);

router.post("/user/requestCourseInstance", User.requestCourseInstanceValidation, validate, User.requestCourseInstance);
router.post("/user/setCourseInstance", User.requestCourseInstanceValidation, validate, User.setCourseInstance);
router.post("/user/setTeam", User.setTeamValidation, validate, User.setTeam);

router.get("/topic", Topic.getAllTopics);
router.get("/topic/:id", Topic.getTopic);
router.delete("/topic/:id", Topic.idValidation, validate, Topic.deleteTopic);
router.patch("/topic/:id", Topic.idValidation, validate, Topic.patchTopic);
router.put("/topic/:id", Topic.idValidation, validate, Topic.putTopic);

router.get("/team", Team.getAllTeams);
router.get("/team/:id", Team.getTeam);

// router.post("/session/lecture", Session.createSessionValidation, validate, Session.createLecture);
// router.post("/session/lab", Session.createSessionValidation, validate, Session.createLab);
// router.get("/session", Session.paramsValidation, validate, Session.getAllSessions);
// router.get("/session/:id", Session.getSession);

router.get("/courseInstance", CourseInstance.getAllCourseInstances);
router.get("/courseInstance/:id", CourseInstance.getCourseInstance);

router.post("/lecture", Validators.createLecture, Event.createLecture);
router.post("/lab", Validators.createLab, Event.createLab);
router.post("/course", Validators.createCourse, Course.createCourse);
router.post("/courseInstance", Validators.createCourseInstance, Event.createCourseInstance);
router.post("/topic", Validators.createTopic, Topic.createTopic);
router.post("/assignment", Task.createAssignment);
router.post("/questionAssignment", Task.createQuestionAssignment);
router.post("/quizAssignment", Task.createQuizAssignment);

// laco
router.post("/codeComment", ReviewComment.createCodeComment);
router.post("/generalComment", ReviewComment.createGeneralComment);
router.post("/submission", Submission.createSubmission);
// router.post("/review", foo);
// router.post("/teamReview", foo);

export default router;
