import {
    PostController,
    GetController,
    Team,
    Topic,
    Course,
    CourseInstance,
    Session,
    Event,
    Task,
    Agent,
    ReviewComment,
    Submission,
    Quiz
} from "../controllers";
import express from "express";
const router = express.Router();

router.post("/:className", (req, res) => {
    const functionName = "create" + req.params.className.charAt(0).toUpperCase() + req.params.className.slice(1);
    if (!PostController[functionName]) {
        res.status(400).send("not implemented");
        return;
    }
    PostController[functionName](req, res);
});

router.get("/:className/:id?", (req, res) => {
    const functionName = "get" + req.params.className.charAt(0).toUpperCase() + req.params.className.slice(1);
    if (!GetController[functionName]) {
        res.status(400).send("not implemented");
        return;
    }
    GetController[functionName](req, res);
});

router.put("/:className/:id", (req, res) => {
    res.send("not implemented");
});

router.patch("/:className/:id/:attributeName", (req, res) => {
    res.send("not implemented");
});

router.delete("/:className/:id/:attributeName?", (req, res) => {
    res.send("not implemented");
});

// router.delete("/user/:id", Agent.deleteUser);
// router.delete("/team/:id", Agent.deleteTeam);
// router.delete("/lecture/:id", Event.deleteLecture);
// router.delete("/lab/:id", Event.deleteLab);
router.delete("/topic/:id", Topic.deleteTopic);
router.delete("/course/:id", Course.deleteCourse);
router.delete("/quizTake/:id/:attributeName?", Quiz.deleteQuizTake);

// router.patch("/team/:id", Agent.patchTeam);
// router.patch("/user/:id", Agent.patchUser);
// router.patch("/lecture/:id", Event.patchLecture);
// router.patch("/lab/:id", Event.patchLab);
router.patch("/topic/:id", Topic.patchTopic);
router.patch("/course/:id", Course.patchCourse);
router.patch("/quizTake/:id/:attributeName?");

export default router;
