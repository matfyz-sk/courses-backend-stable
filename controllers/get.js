import User from "../model/Agent/User";
import Team from "../model/Agent/Team";
import EssayQuestion from "../model/Question/EssayQuestion";
import OpenQuestion from "../model/Question/OpenQuestion";
import QuestionWithPredefinedAnswer from "../model/Question/QuestionWithPredefinedAnswer";
import OrderedQuestion from "../model/OrderedQuestion";
import QuizTake from "../model/QuizTake";
import QuizTakePrototype from "../model/QuizTakePrototype";
import DirectAnswer from "../model/UserAnswer/DirectAnswer";
import OrderedAnswer from "../model/UserAnswer/OrderedAnswer";
import PredefinedAnswer from "../model/PredefinedAnswer";
import QuestionComment from "../model/QuestionComment";
import Lab from "../model/Event/Session/Lab";
import Lecture from "../model/Event/Session/Lecture";
import OralExam from "../model/Event/TaskEvent/ExaminationEvent/OralExam";
import TestTake from "../model/Event/TaskEvent/ExaminationEvent/TestTake";
import CourseInstance from "../model/Event/CourseInstance";
import Course from "../model/Course";
import Topic from "../model/Topic";

function runQuery(resource, req, res) {
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = resource.generateQuery(req.query);
    query
        .run()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => res.status(500).send(err));
}

export function getQuizTake(req, res) {
    runQuery(new QuizTake(), req, res);
}

export function getQuizTakePrototype(req, res) {
    runQuery(new QuizTakePrototype(), req, res);
}

export function getEssayQuestion(req, res) {
    runQuery(new EssayQuestion(), req, res);
}

export function getOpenQuestion(req, res) {
    runQuery(new OpenQuestion(), req, res);
}

export function getOrderedQuestion(req, res) {
    runQuery(new OrderedQuestion(), req, res);
}

export function getQwpa(req, res) {
    runQuery(new QuestionWithPredefinedAnswer(), req, res);
}

export function getDirectAnswer(req, res) {
    runQuery(new DirectAnswer(), req, res);
}

export function getOrderedAnswer(req, res) {
    runQuery(new OrderedAnswer(), req, res);
}

export function getPredefinedAnswer(req, res) {
    runQuery(new PredefinedAnswer(), req, res);
}

export function getTeam(req, res) {
    runQuery(new Team(), req, res);
}

export function getUser(req, res) {
    runQuery(new User(), req, res);
}

export function getLab(req, res) {
    runQuery(new Lab(), req, res);
}

export function getLecture(req, res) {
    runQuery(new Lecture(), req, res);
}

export function getOralExam(req, res) {
    runQuery(new OralExam(), req, res);
}

export function getTestTake(req, res) {
    runQuery(new TestTake(), req, res);
}

export function getCourse(req, res) {
    runQuery(new Course(), req, res);
}

export function getCourseInstance(req, res) {
    runQuery(new CourseInstance(), req, res);
}

export function getTopic(req, res) {
    runQuery(new Topic(), req, res);
}
