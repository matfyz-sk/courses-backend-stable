import { body, param, validationResult, query } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate, resourceExists, prepareQueryUri } from "../helpers";
import { db } from "../config/client";

// prettier-ignore
export const createSessionValidation = [
    body("name").exists(),
    body("description").exists(),
    body("location").exists(),
    body("date").exists(),
    body("time").exists(),
    body("duration").exists(),
    body("course")
        .exists().bail()
        .isURL().bail()
        .custom(value => resourceExists(value, Classes.CourseInstance)),
    body("hasInstructor")
        .exists().withMessage("Missing required field")
        .isArray().withMessage("Field is not array")
        .not().isEmpty().withMessage("List of instructors cannot be empty"),
    body("hasInstructor.*")
        .isURL()
        .bail()
        .custom(value => resourceExists(value, Classes.User)),
    body("covers")
        .exists().bail()
        .isArray(),
    body("covers.*")
        .isURL().bail()
        .custom(value => resourceExists(value, Classes.Topic)),
    body("uses")
        .exists().bail()
        .isArray(),
    body("uses.*")
        .isURL().bail()
        .custom(value => resourceExists(value, Classes.Material))
];

export const paramsValidation = [query("courseInstance").exists()];

export async function createLecture(req, res) {
    createSession(req.body, Classes.Lecture)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).send(err));
}

export async function createLab(req, res) {
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
    var newNode;
    if (sessionType == Classes.Lecture) newNode = await getNewNode(Constants.lectureURI);
    else newNode = await getNewNode(Constants.labURI);
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
    return db.store(true);
}

export function getSessions(req, res) {
    const courseInstanceURI = prepareQueryUri(req.query.courseInstance, Classes.CourseInstance);
    const q = new Query();
    q.setProto({
        id: "?sessionURI",
        type: predicate(Predicates.type),
        course: courseInstanceURI,
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
        `?sessionURI ${Predicates.hasInstructor} ?userURI`
    ]);
    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}
