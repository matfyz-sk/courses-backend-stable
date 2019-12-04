import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, resourceExists } from "../helpers";
import { db } from "../config/client";

// prettier-ignore
export const createCourseInstanceValidation = [
    body("instanceOf")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .custom(value => resourceExists(value, Classes.Course)),
    body("year")
        .exists().withMessage(Messages.MISSING_FIELD),
    body("hasInstructor")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY),
    body("hasInstructor.*")
        .custom(value => resourceExists(value, Classes.User))
];

export async function createCourseInstance(req, res) {
    const newCourseInstance = await getNewNode(Constants.courseInstancesURI);
    var triples = [
        new Triple(newCourseInstance, Predicates.type, Classes.CourseInstance),
        new Triple(newCourseInstance, Predicates.year, new Text(req.body.year)),
        new Triple(newCourseInstance, Predicates.instanceOf, new Node(req.body.instanceOf))
    ];
    for (var userURI of req.body.hasInstructor) {
        triples.push(new Triple(newCourseInstance, Predicates.hasInstructor, new Node(userURI)));
    }
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(201).send(newCourseInstance))
        .catch(err => res.status(500).send(err));
}

export async function getAllCourseInstances(req, res) {
    const year = req.query.year != null && req.query.year.length > 0 ? req.query.year : "";
    const courseId = req.query.courseId != null && req.query.courseId.length > 0 ? req.query.courseId : "";

    const q = new Query();
    q.setProto({
        id: "?instanceId",
        year: predicate(Predicates.year),
        instanceOf: predicate(Predicates.instanceOf),
        hasInstructor: {
            id: "?insId"
        }
    });
    q.setWhere([`?instanceId ${Predicates.type} ${Classes.CourseInstance}`, `OPTIONAL { ?instanceId ${Predicates.hasInstructor} ?insId }`]);

    if (year.length > 0) q.appendWhere(`?instanceId ${Predicates.year} "${year}"`);
    if (courseId.length > 0) q.appendWhere(`?instanceId ${Predicates.instanceOf} ${buildUri(Constants.coursesURI, courseId)}`);

    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export function getCourseInstance(req, res) {}
