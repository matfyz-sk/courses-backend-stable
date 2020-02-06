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
import Course from "../model/Course";

function storeResource(resource, req, res) {
    for (var p of resource.predicates) {
        if (p.required || req.body[p.predicate.value]) resource[p.predicate.value] = req.body[p.predicate.value];
    }
    resource
        .store()
        .then(data => res.status(201).send(resource.subject))
        .catch(err => res.status(500).send(err));
}

export default {
    createUser: (req, res) => storeResource(new User(), req, res),
    createTeam: (req, res) => storeResource(new Team(), req, res),
    createCourse: (req, res) => storeResource(new Course(), req, res),
    createEssayQuestion: (req, res) => storeResource(new EssayQuestion(), req, res),
    createOpenQuestion: (req, res) => storeResource(new OpenQuestion(), req, res),
    createQuestionWithPredefinedAnswer: (req, res) => storeResource(new QuestionWithPredefinedAnswer(), req, res),
    createOrderedQuestion: (req, res) => storeResource(new OrderedQuestion(), req, res),
    createQuizTake: (req, res) => storeResource(new QuizTake(), req, res),
    createQuizTakePrototype: (req, res) => storeResource(new QuizTakePrototype(), req, res),
    createDirectAnswer: (req, res) => storeResource(new DirectAnswer(), req, res),
    createOrderedAnswer: (req, res) => storeResource(new OrderedAnswer(), req, res),
    createPredefinedAnswer: (req, res) => storeResource(new PredefinedAnswer(), req, res),
    createQuestionComment: (req, res) => storeResource(new QuestionComment(), req, res)
};
