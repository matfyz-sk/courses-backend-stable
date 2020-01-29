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
import OrderedQuestion from "../model/OrderedQuestion";

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

export function getAllEssayQuestions(req, res) {
    const essayQuestion = new EssayQuestion();
    const query = essayQuestion.generateQuery(req.query);
    runQuery(query, res);
}

export function getAllOpenQuestions(req, res) {
    const openQuestion = new OpenQuestion();
    const query = openQuestion.generateQuery(req.query);
    runQuery(query, res);
}

export function getAllOrderedQuestions(req, res) {
    const orderedQuestion = new OrderedQuestion();
    runQuery(orderedQuestion.generateQuery(req.query), res);
}
