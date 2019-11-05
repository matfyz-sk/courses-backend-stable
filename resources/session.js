import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { getNewNode, validateRequestBody } from "../helpers";
import Query from "../query/Query";
import { Client, Node, Text, Data, Triple } from "virtuoso-sparql-client";
import express from "express";
import { createSessionRequest } from "../constants/schemas";

const router = express.Router();

const db = new Client(Constants.virtuosoEndpoint);
db.addPrefixes({
    courses: Constants.ontologyURI
});
db.setQueryFormat("application/json");
db.setQueryGraph(Constants.graphURI);
db.setDefaultGraph(Constants.graphURI);

router.post("/lecture", async (req, res) => {
    const validationResult = validateRequestBody(req.body, createSessionRequest);
    if (validationResult.length > 0) {
        res.status(400).json({
            errorType: "BAD_REQUEST",
            errorMessages: validationResult
        });
        return;
    }
    createSession(req.body, Classes.Lecture)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
});

router.post("/lab", async (req, res) => {
    const validationResult = validateRequestBody(req.body, createSessionRequest);
    if (validationResult.length > 0) {
        res.status(400).json({
            errorType: "BAD_REQUEST",
            errorMessages: validationResult
        });
        return;
    }
    createSession(req.body, Classes.Lab)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
});

async function createSession(data, sessionType) {
    const { course, covers, uses, hasInstructor, name, date, time, duration, location, description } = data;

    // TODO check if Course Instance exists
    // TODO check if Topics exists
    // TODO check if Materials exists
    // TODO check if User exists

    var newNode;
    if (sessionType == Classes.Lecture) newNode = await getNewNode(Constants.lectureURI);
    else newNode = await getNewNode(Constants.labURI);

    var triples = [
        new Triple(newNode, Predicates.type, sessionType),
        new Triple(newNode, Predicates.course, new Node(course)),
        new Triple(newNode, Predicates.label, new Text(name)),
        new Triple(newNode, Predicates.date, new Data(new Date(date).toISOString(), "xsd:date")),
        new Triple(newNode, Predicates.time, new Text(time)),
        new Triple(newNode, Predicates.duration, new Data(duration, "xsd:integer")),
        new Triple(newNode, Predicates.location, new Text(location)),
        new Triple(newNode, Predicates.description, new Text(description))
    ];
    if (covers)
        for (var topic of covers) {
            triples.push(new Triple(newNode, Predicates.covers, new Node(topic)));
        }
    if (uses)
        for (var material of uses) {
            triples.push(new Triple(newNode, Predicates.uses, new Node(material)));
        }
    for (var user of hasInstructor) {
        triples.push(new Triple(newNode, Predicates.hasInstructor, new Node(user)));
    }
    db.getLocalStore().bulk(triples);
    return db.store(true);
}

exports.sessionsRouter = router;
