import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate } from "../helpers";
import { db } from "../config/client";

export const createSessionValidation = [
    body("name").exists(),
    body("description").exists(),
    body("location").exists(),
    body("date").exists(),
    body("time").exists(),
    body("duration").exists(),
    body("course")
        .exists()
        .isURL(),
    body("hasInstructor")
        .exists()
        .isArray(),
    body("hasInstructor.*").isURL(),
    body("covers")
        .exists()
        .isArray(),
    body("covers.*").isURL(),
    body("uses")
        .exists()
        .isArray(),
    body("uses.*").isURL()
];

export async function createLecture(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    createSession(req.body, Classes.Lecture)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).send(err));
}

export async function createLab(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    createSession(req.body, Classes.Lab)
        .then(result => {
            if (result.status) res.status(result.status).json(result);
            else {
            }
        })
        .catch(err => res.status(500).send(err));
}

async function createSession(data, sessionType) {
    const { course, covers, uses, hasInstructor, name, date, time, duration, location, description } = data;

    // if (!(await resourceExists(course, Classes.Course))) {
    //     return { status: 404, message: RESOURCE_NOT_EXISTS(course) };
    // }

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
