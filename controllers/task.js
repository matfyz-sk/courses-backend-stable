import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export async function createAssignment(req, res) {
    var newAssignment = await getNewNode(Constants.assignmentURI);
    var triples = [
        new Triple(newAssignment, Predicates.type, Classes.Assignment),
        new Triple(newAssignment, Predicates.subclassOf, Classes.Task)
    ];
    // TODO initialSubmissionPeriod AssignmentPeriod
    // TODO peerReviewPeriod AssignmentPeriod
    // TODO improvedSubmissionPeriod AssignmentPeriod
    // TODO teamReviewPeriod AssignmentPeriod
    createTask(req, res, newAssignment, triples);
}
export async function createQuizAssignment(req, res) {
    var newQuizAssignment = await getNewNode(Constants.quizAssignmentURI);
    var triples = [
        new Triple(newQuizAssignment, Predicates.type, Classes.QuizAssignment),
        new Triple(newQuizAssignment, Predicates.subclassOf, Classes.Task)
    ];
    // TODO takingEvent TaskEvent
    createTask(req, res, newQuizAssignment, triples);
}
export async function createQuestionAssignment(req, res) {
    var newQuestionAssignment = await getNewNode(Constants.questionAssignmentURI);
    var triples = [
        new Triple(newQuestionAssignment, Predicates.type, Classes.QuestionAssignment),
        new Triple(newQuestionAssignment, Predicates.subclassOf, Classes.Task)
    ];
    // TODO creationPeriod TaskEvent
    createTask(req, res, newQuestionAssignment, triples);
}

function createTask(req, res, subject, triples) {
    if (req.body.covers) {
        for (topicURI of req.body.covers) triples.push(new Triple(subject, Predicates.covers, new Node(topicURI)));
    }
    if (req.body.mentions) {
        for (topicURI of req.body.mentions) triples.push(new Triple(subject, Predicates.mentions, new Node(topicURI)));
    }
    if (req.body.requires) {
        for (topicURI of req.body.requires) triples.push(new Triple(subject, Predicates.requires, new Node(topicURI)));
    }
    console.log("triples:", triples);
    // db.getLocalStore().bulk(triples);
    // db.store(true)
    //     .then(result => res.status(201).send(subject))
    //     .catch(err => res.status(500).send(err));
    res.status(200).send();
}
