import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import Assignment from "../model/Task/Assignment";
import QuizAssignment from "../model/Task/QuizAssignment";
import QuestionAssignment from "../model/Task/QuestionAssignment";
import { deleteResource } from "./main";

export function createAssignment(req, res) {
    const assignment = new Assignment();
    assignment.initialSubmissionPeriod = req.body.initialSubmissionPeriod;
    assignment.peerReviewPeriod = req.body.peerReviewPeriod;
    assignment.improvedSubmissionPeriod = req.body.improvedSubmissionPeriod;
    assignment.teamReviewPeriod = req.body.teamReviewPeriod;
    assignment.covers = req.body.covers;
    assignment.mentions = req.body.mentions;
    assignment.requires = req.body.requires;
    assignment
        .store()
        .then(data => res.status(201).send(assignment.subject))
        .catch(err => res.status(500).send(err));
}

export function createQuizAssignment(req, res) {
    const quizAssignment = new QuizAssignment();
    quizAssignment.covers = req.body.covers;
    quizAssignment.mentions = req.body.mentions;
    quizAssignment.requires = req.body.requires;
    quizAssignment
        .store()
        .then(data => res.status(201).send(quizAssignment.subject))
        .catch(err => res.status(500).send(err));
}

export function createQuestionAssignment(req, res) {
    const questionAssignment = new QuestionAssignment();
    questionAssignment.covers = req.body.covers;
    questionAssignment.mentions = req.body.mentions;
    questionAssignment.requires = req.body.requires;
    questionAssignment
        .store()
        .then(data => res.status(201).send(questionAssignment.subject))
        .catch(err => res.status(500).send(err));
}

export function deleteAssignment(req, res) {
    const assignment = new Assignment(buildUri(Constants.assignmentURI, req.params.id, false));
    deleteResource(assignment, res);
}

export function deleteQuizAssignment(req, res) {
    const quizAssignment = new QuizAssignment(buildUri(Constants.quizAssignmentURI, req.params.id, false));
    deleteResource(quizAssignment, res);
}

export function deleteQuestionAssignment(req, res) {
    const questionAssignment = new QuestionAssignment(buildUri(Constants.questionAssignmentURI, req.params.id, false));
    deleteResource(questionAssignment, res);
}

export function patchAssignment(req, res) {}
