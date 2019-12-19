import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export function getAllQuestionVersions(req, res) {
    const q = new Query();
    q.setProto([
        {
            "@type": "QuestionVersion",
            "@id": "?id",
            name: predicate(Predicates.name)
        }
    ]);
    q.setWhere([`?id ${Predicates.subclassOf} ${Classes.QuestionVersion}`]);
    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}
