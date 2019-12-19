import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export async function createCodeComment(req, res) {
    var newCodeComment = await getNewNode(Constants.codeCommentURI);
    var triples = [
        new Triple(newCodeComment, Predicates.type, Classes.CodeComment),
        new Triple(newCodeComment, Predicates.author, new Node(req.body.author)),
        new Triple(newCodeComment, Predicates.time, new Text(req.body.time)),
        new Triple(newCodeComment, Predicates.comment, new Text(req.body.comment)),
        new Triple(newCodeComment, Predicates.commentedText, new Text(req.body.commentedText)),
        new Triple(newCodeComment, Predicates.occurance, new Data(req.body.occurance)),
        new Triple(newCodeComment, Predicates.filePath, new Text(req.body.filePath)),
        new Triple(new Node(req.body.codeReview), Predicates.hasCodeComment, newCodeComment)
    ];
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(data => res.status(201).send(newCodeComment))
        .catch(err => res.status(500).send(err));
}

export async function createGeneralComment(req, res) {
    var newGeneralComment = await getNewNode(Constants.generalCommentURI);
    var triples = [
        new Triple(newGeneralComment, Predicates.type, Classes.GeneralComment),
        new Triple(newGeneralComment, Predicates.author, new Node(req.body.author)),
        new Triple(newGeneralComment, Predicates.time, new Text(req.body.time)),
        new Triple(newGeneralComment, Predicates.comment, new Text(req.body.comment)),
        new Triple(new Node(req.body.codeReview), Predicates.hasGeneralComment, newGeneralComment)
    ];
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(data => res.status(201).send(newGeneralComment))
        .catch(err => res.status(500).send(err));
}
