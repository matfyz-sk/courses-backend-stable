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
    resource
        .store()
        .then(data => res.status(201).send(resource.subject))
        .catch(err => res.status(500).send(err));
}

export function createUser(req, res) {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.description = req.body.description;
    user.nickname = req.body.nickname;
    user.avatar = req.body.avatar;
    user.name = req.body.name;
    if (req.body.memberOf) user.memberOf = req.body.memberOf;
    storeResource(user, req, res);
}

export function createTeam(req, res) {
    const team = new Team();
    team.name = req.body.name;
    team.avatar = req.body.avatar;
    team.courseInstance = req.body.courseInstance;
    storeResource(team, req, res);
}

export function createEssayQuestion(req, res) {
    const essayQuestion = new EssayQuestion();
    essayQuestion.name = req.body.name;
    essayQuestion.text = req.body.text;
    essayQuestion.visibilityIsRestricted = req.body.visibilityIsRestricted;
    essayQuestion.hasQuestionState = req.body.hasQuestionState;
    essayQuestion.ofTopic = req.body.ofTopic;
    essayQuestion.hasAuthor = req.body.hasAuthor;
    essayQuestion.hasComment = req.body.hasComment;
    essayQuestion.approver = req.body.approver;
    essayQuestion.hasChangeEvent = req.body.hasChangeEvent;
    storeResource(essayQuestion, req, res);
}

export function createOpenQuestion(req, res) {
    const openQuestion = new OpenQuestion();
    openQuestion.regexp = req.body.regexp;
    openQuestion.name = req.body.name;
    openQuestion.text = req.body.text;
    openQuestion.visibilityIsRestricted = req.body.visibilityIsRestricted;
    openQuestion.hasQuestionState = req.body.hasQuestionState;
    openQuestion.ofTopic = req.body.ofTopic;
    openQuestion.hasAuthor = req.body.hasAuthor;
    openQuestion.hasComment = req.body.hasComment;
    openQuestion.approver = req.body.approver;
    openQuestion.hasChangeEvent = req.body.hasChangeEvent;
    storeResource(openQuestion, req, res);
}

export function createQuestionWithPredefinedAnswer(req, res) {
    const qwpa = new QuestionWithPredefinedAnswer();
    qwpa.hasAnswer = req.body.hasAnswer;
    qwpa.name = req.body.name;
    qwpa.text = req.body.text;
    qwpa.visibilityIsRestricted = req.body.visibilityIsRestricted;
    qwpa.hasQuestionState = req.body.hasQuestionState;
    qwpa.ofTopic = req.body.ofTopic;
    qwpa.hasAuthor = req.body.hasAuthor;
    qwpa.hasComment = req.body.hasComment;
    qwpa.approver = req.body.approver;
    qwpa.hasChangeEvent = req.body.hasChangeEvent;
    storeResource(qwpa, req, res);
}

export function createOrderedQuestion(req, res) {
    const orderedQuestion = new OrderedQuestion();
    orderedQuestion.question = req.body.question;
    orderedQuestion.userAnswer = req.body.userAnswer;
    orderedQuestion.quizTake = req.body.quizTake;
    orderedQuestion.next = req.body.next;
    storeResource(openQuestion, req, res);
}

export function createQuizTake(req, res) {
    const quizTake = new QuizTake();
    quizTake.startDate = req.body.startDate;
    quizTake.endDate = req.body.endDate;
    quizTake.submitedDate = req.body.submitedDate;
    quizTake.reviewedDate = req.body.reviewedDate;
    quizTake.hasAuthor = req.body.hasAuthor;
    storeResource(quizTake, req, res);
}

export function createQuizTakePrototype(req, res) {
    const quizTakePrototype = new QuizTakePrototype();
    quizTakePrototype.orderedQuestion = req.body.orderedQuestion;
    storeResource(quizTakePrototype, req, res);
}

export function createDirectAnswer(req, res) {
    const directAnswer = new DirectAnswer();
    directAnswer.text = req.body.text;
    directAnswer.orderedQuestion = req.body.orderedQuestion;
    directAnswer.score = req.body.score;
    storeResource(directAnswer, req, res);
}

export function createOrderedAnswer(req, res) {
    const orderedAnswer = new OrderedAnswer();
    orderedAnswer.position = req.body.position;
    orderedAnswer.userChoice = req.body.userChoice;
    orderedAnswer.predefinedAnswer = req.body.predefinedAnswer;
    orderedAnswer.score = req.body.score;
    orderedAnswer.orderedQuestion = req.body.orderedQuestion;
    storeResource(orderedAnswer, req, res);
}

export function createPredefinedAnswer(req, res) {
    const predefinedAnswer = new PredefinedAnswer();
    predefinedAnswer.text = req.body.text;
    predefinedAnswer.position = req.body.position;
    predefinedAnswer.correct = req.body.correct;
    storeResource(predefinedAnswer, req, res);
}

export function createQuestionComment(req, res) {
    const questionComment = new QuestionComment();
    questionComment.commentText = req.body.commentText;
    questionComment.hasAuthor = req.body.hasAuthor;
    questionComment.created = req.body.created;
    storeResource(questionComment, req, res);
}

export function createCourse(req, res) {
    const course = new Course();
    course.name = req.body.name;
    course.description = req.body.description;
    course.abbreviation = req.body.abbreviation;
    course.hasPrerequisite = req.body.hasPrerequisite;
    course.mentions = req.body.mentions;
    course.covers = req.body.covers;
    storeResource(course, req, res);
}
