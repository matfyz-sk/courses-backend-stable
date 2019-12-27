import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";
import CodeComment from "../model/CodeComment";
import CodeReview from "../model/CodeReview";
import GeneralComment from "../model/GeneralComment";

export async function createCodeComment(req, res) {
    const codeComment = new CodeComment();
    codeComment.creator = req.body.creator;
    codeComment.commentTime = req.body.commentTime;
    codeComment.commentText = req.body.commentText;
    codeComment.commentedText = req.body.commentedText;
    codeComment.occurance = req.body.occurance;
    codeComment.filePath = req.body.filePath;
    codeComment
        .store()
        .then(data => {
            const codeReview = new CodeReview(req.body.codeReviewURI);
            codeReview.hasCodeComment = data.iri;
            return codeReview.store();
        })
        .then(data => res.status(201).send())
        .catch(err => res.status(500).send());
}

export async function createGeneralComment(req, res) {
    const generalComment = new GeneralComment();
    generalComment.creator = req.body.creator;
    generalComment.commentTime = req.body.commentTime;
    generalComment.commentText = req.body.commentText;
    generalComment
        .store()
        .then(data => {
            const codeReview = new CodeReview(req.body.codeReviewURI);
            codeReview.hasCodeComment = data.iri;
            return codeReview.store();
        })
        .then(data => res.status(201).send())
        .catch(err => res.status(500).send());
}
