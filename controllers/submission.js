import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export async function createSubmission(req, res) {
    var newSubmission = await getNewNode(Constants.submissionURI);
    var triples = [
        new Triple(newSubmission, Predicates.type, Classes.Submission),
        new Triple(newSubmission, Predicates.ofAssignment, new Node(req.body.ofAssignment)),
        new Triple(newSubmission, Predicates.submittedByStudent, new Node(req.body.submittedByStudent)),
        new Triple(newSubmission, Predicates.submittedByTeam, new Node(req.body.submittedByTeam)),
        new Triple(newSubmission, Predicates.submittedAt, new Text(req.body.submittedAt))
    ];
    for (var submittedFieldURI of req.body.submittedField) {
        triples.push(new Triple(newSubmission, Predicates.submittedField, new Node(submittedFieldURI)));
    }
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(data => res.status(201).send(newSubmission))
        .catch(err => res.status(500).send(err));
}

export async function patchSubmission(req, res) {
    const submissionURI = buildUri(Constants.assignmentURI, req.params.id);
}
