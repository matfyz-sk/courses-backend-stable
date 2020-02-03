import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";
import User from "../model/Agent/User";
import Team from "../model/Agent/Team";
import EssayQuestion from "../model/Question/EssayQuestion";
import { runQuery } from "./main";
import OpenQuestion from "../model/Question/OpenQuestion";
import QuestionWithPredefinedAnswer from "../model/Question/QuestionWithPredefinedAnswer";
import OrderedQuestion from "../model/OrderedQuestion";
import QuizTake from "../model/QuizTake";
import QuizTakePrototype from "../model/QuizTakePrototype";
import DirectAnswer from "../model/UserAnswer/DirectAnswer";
import OrderedAnswer from "../model/UserAnswer/OrderedAnswer";
import PredefinedAnswer from "../model/PredefinedAnswer";
import QuestionComment from "../model/QuestionComment";

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
    essayQuestion
        .store()
        .then(data => res.status(201).send(essayQuestion.subject))
        .catch(err => res.status(500).send(err));
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
    openQuestion
        .store()
        .then(data => res.status(201).send(openQuestion.subject))
        .catch(err => res.status(500).send(err));
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
    qwpa.store()
        .then(data => res.status(201).send(qwpa.subject))
        .catch(err => res.status(500).send(err));
}

export function createOrderedQuestion(req, res) {
    const orderedQuestion = new OrderedQuestion();
    orderedQuestion.question = req.body.question;
    orderedQuestion.userAnswer = req.body.userAnswer;
    orderedQuestion.quizTake = req.body.quizTake;
    orderedQuestion.next = req.body.next;
    openQuestion
        .store()
        .then(data => res.status(201).send(orderedQuestion.subject))
        .catch(err => res.status(500).send(err));
}

export function createQuizTake(req, res) {
    const quizTake = new QuizTake();
    quizTake.startDate = req.body.startDate;
    quizTake.endDate = req.body.endDate;
    quizTake.submitedDate = req.body.submitedDate;
    quizTake.reviewedDate = req.body.reviewedDate;
    quizTake.hasAuthor = req.body.hasAuthor;
    quizTake
        .store()
        .then(data => res.status(201).send(quizTake.subject))
        .catch(err => res.status(500).send(err));
}

export function createQuizTakePrototype(req, res) {
    const quizTakePrototype = new QuizTakePrototype();
    quizTakePrototype.orderedQuestion = req.body.orderedQuestion;
    quizTakePrototype
        .store()
        .then(data => res.status(201).send(quizTakePrototype.subject))
        .catch(err => res.status(500).send(err));
}

export function createDirectAnswer(req, res) {
    const directAnswer = new DirectAnswer();
    directAnswer.text = req.body.text;
    directAnswer.orderedQuestion = req.body.orderedQuestion;
    directAnswer.score = req.body.score;
    directAnswer
        .store()
        .then(data => res.status(201).send(directAnswer.subject))
        .catch(err => res.status(500).send(err));
}

export function createOrderedAnswer(req, res) {
    const orderedAnswer = new OrderedAnswer();
    orderedAnswer.position = req.body.position;
    orderedAnswer.userChoice = req.body.userChoice;
    orderedAnswer.predefinedAnswer = req.body.predefinedAnswer;
    orderedAnswer.score = req.body.score;
    orderedAnswer.orderedQuestion = req.body.orderedQuestion;
    orderedAnswer
        .store()
        .then(data => res.status(201).send(orderedAnswer.subject))
        .catch(err => res.status(500).send(err));
}

export function createPredefinedAnswer(req, res) {
    const predefinedAnswer = new PredefinedAnswer();
    predefinedAnswer.text = req.body.text;
    predefinedAnswer.position = req.body.position;
    predefinedAnswer.correct = req.body.correct;
    predefinedAnswer
        .store()
        .then(data => res.status(201).send(predefinedAnswer.subject))
        .catch(err => res.status(500).send(err));
}

export function createQuestionComment(req, res) {
    const questionComment = new QuestionComment();
    questionComment.commentText = req.body.commentText;
    questionComment.hasAuthor = req.body.hasAuthor;
    questionComment.created = req.body.created;
    questionComment
        .store()
        .then(data => res.status(201).send(questionComment.subject))
        .catch(err => res.status(500).send(err));
}

export function getQuizTake(req, res) {
    const quizTake = new QuizTake();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = quizTake.generateQuery(req.query);
    runQuery(query, res);
}

export function getQuizTakePrototype(req, res) {
    const quizTakePrototype = new QuizTakePrototype();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = quizTakePrototype.generateQuery(req.query);
    runQuery(query, res);
}

export function getEssayQuestion(req, res) {
    const essayQuestion = new EssayQuestion();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = essayQuestion.generateQuery(req.query);
    runQuery(query, res);
}

export function getOpenQuestion(req, res) {
    const openQuestion = new OpenQuestion();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = openQuestion.generateQuery(req.query);
    runQuery(query, res);
}

export function getOrderedQuestion(req, res) {
    const orderedQuestion = new OrderedQuestion();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    runQuery(orderedQuestion.generateQuery(req.query), res);
}

export function getQwpa(req, res) {
    const qwpa = new QuestionWithPredefinedAnswer();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = qwpa.generateQuery(req.query);
    runQuery(query, res);
}

export function getDirectAnswer(req, res) {
    const directAnswer = new DirectAnswer();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = directAnswer.generateQuery(req.query);
    runQuery(query, res);
}

export function getOrderedAnswer(req, res) {
    const orderedAnswer = new OrderedAnswer();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = orderedAnswer.generateQuery(req.query);
    runQuery(query, res);
}

export function getPredefinedAnswer(req, res) {
    const predefinedAnswer = new PredefinedAnswer();
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = predefinedAnswer.generateQuery(req.query);
    runQuery(query, res);
}
