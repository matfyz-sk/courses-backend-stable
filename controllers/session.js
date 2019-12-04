import { body, param, validationResult, query } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, resourceExists, prepareQueryUri } from "../helpers";
import { db } from "../config/client";

// prettier-ignore
export const createSessionValidation = [
    body("name").exists().withMessage(Messages.MISSING_FIELD),
    body("description").exists().withMessage(Messages.MISSING_FIELD),
    body("location").exists().withMessage(Messages.MISSING_FIELD),
    body("date").exists().withMessage(Messages.MISSING_FIELD),
    body("time").exists().withMessage(Messages.MISSING_FIELD),
    body("duration").exists().withMessage(Messages.MISSING_FIELD),
    body("course")
        .exists().withMessage(Messages.MISSING_FIELD).bail()
        .isURL().bail()
        .custom(value => resourceExists(value, Classes.CourseInstance)),
    body("hasInstructor")
        .exists().withMessage(Messages.MISSING_FIELD)
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY)
        .not().isEmpty().withMessage("List of instructors cannot be empty"),
    body("hasInstructor.*")
        .isURL()
        .bail()
        .custom(value => resourceExists(value, Classes.User)),
    body("covers")
        .exists().withMessage(Messages.MISSING_FIELD).bail()
        .isArray(),
    body("covers.*")
        .isURL().bail()
        .custom(value => resourceExists(value, Classes.Topic)),
    body("uses")
        .exists().withMessage(Messages.MISSING_FIELD).bail()
        .isArray(),
    body("uses.*")
        .isURL().bail()
        .custom(value => resourceExists(value, Classes.Material))
];

export const paramsValidation = [
    query("course")
        .exists()
        .withMessage(Messages.MISSING_FIELD)
];

export async function createLecture(req, res) {
    createSession(req, res, Classes.Lecture);
}

export async function createLab(req, res) {
    createSession(req, res, Classes.Lab);
}

async function createSession(req, res, sessionType) {
    const { course, covers, uses, hasInstructor, name, date, time, duration, location, description } = req.body;
    var newNode = sessionType == Classes.Lecture ? await getNewNode(Constants.lectureURI) : await getNewNode(Constants.labURI);
    var triples = [
        new Triple(newNode, Predicates.type, sessionType),
        new Triple(newNode, Predicates.subclassOf, Classes.Session),
        new Triple(newNode, Predicates.course, new Node(course)),
        new Triple(newNode, Predicates.label, new Text(name)),
        new Triple(newNode, Predicates.date, new Data(new Date(date).toISOString(), "xsd:date")),
        new Triple(newNode, Predicates.time, new Text(time)),
        new Triple(newNode, Predicates.duration, new Data(duration, "xsd:integer")),
        new Triple(newNode, Predicates.location, new Text(location)),
        new Triple(newNode, Predicates.description, new Text(description))
    ];
    for (var topicURI of covers) {
        triples.push(new Triple(newNode, Predicates.covers, new Node(topicURI)));
    }
    for (var materialURI of uses) {
        triples.push(new Triple(newNode, Predicates.uses, new Node(materialURI)));
    }
    for (var userURI of hasInstructor) {
        triples.push(new Triple(newNode, Predicates.hasInstructor, new Node(userURI)));
    }
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(data => res.status(201).send(newNode))
        .catch(err => res.status(500).send(err));
}

export function getAllSessions(req, res) {
    const courseInstanceURI = buildUri(Constants.courseInstancesURI, req.query.course);
    const q = new Query();
    q.setProto({
        id: "?sessionURI",
        type: predicate(Predicates.type),
        course: predicate(Predicates.course),
        name: predicate(Predicates.label),
        date: predicate(Predicates.date),
        time: predicate(Predicates.time),
        duration: predicate(Predicates.duration),
        location: predicate(Predicates.location),
        description: predicate(Predicates.description),
        covers: {
            id: "?topicURI"
        },
        uses: {
            id: "?materialURI"
        },
        hasInstructor: {
            id: "?userURI"
        }
    });
    q.setWhere([
        `?sessionURI ${Predicates.subclassOf} ${Classes.Session}`,
        `OPTIONAL {?sessionURI ${Predicates.covers} ?topicURI}`,
        `OPTIONAL {?sessionURI ${Predicates.uses} ?materialURI}`,
        `?sessionURI ${Predicates.hasInstructor} ?userURI`,
        `?sessionURI ${Predicates.course} ${courseInstanceURI}`
    ]);
    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export function getSession(req, res) {}
