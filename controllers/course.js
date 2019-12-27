import { body } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";
import Course from "../model/Course";

export function createCourse(req, res) {
    const course = new Course();
    course.name = req.body.name;
    course.description = req.body.description;
    course.abbreviation = req.body.abbreviation;
    course.hasPrerequisite = req.body.hasPrerequisite;
    course.mentions = req.body.mentions;
    course.covers = req.body.covers;
    course
        .store()
        .then(data => res.status(201).send(course.subject))
        .catch(error => res.status(500).send(error));
}

export async function patchCourse(req, res) {
    const course = new Course(buildUri(Constants.coursesURI, req.params.id, false));
    course
        .fetch()
        .then(data => {
            course._fill(course.prepareData(data));
            if (req.body.name) course.name = req.body.name;
            if (req.body.description) course.description = req.body.description;
            if (req.body.abbreviation) course.abbreviation = req.body.abbreviation;
            if (req.body.hasPrerequisite) course.hasPrerequisite = req.body.hasPrerequisite;
            if (req.body.mentions) course.mentions = req.body.mentions;
            if (req.body.covers) course.covers = req.body.covers;
            course.patch();
        })
        .then(data => res.status(200).send(data))
        .catch(error => res.status(500).send(error));
}

export async function deleteCourse(req, res) {
    const course = new Course(buildUri(Constants.coursesURI, req.params.id, false));
    course
        .fetch()
        .then(data => {
            course._fill(course.prepareData(data));
            course.delete();
        })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export function getAllCourses(req, res) {
    const q = new Query();
    q.setProto({
        "@id": "?courseId",
        "@type": Classes.Course,
        name: predicate(Predicates.name),
        description: predicate(Predicates.description),
        abbreviation: predicate(Predicates.abbreviation),
        hasPrerequisite: {
            id: "?prereqId"
        },
        mentions: {
            id: "?mentionsTopicId"
        },
        covers: {
            id: "?coversTopicId"
        }
    });
    q.setWhere([
        `?courseId ${Predicates.type} ${Classes.Course}`,
        `OPTIONAL { ?courseId ${Predicates.hasPrerequisite} ?prereqId }`,
        `OPTIONAL { ?courseId ${Predicates.mentions} ?mentionsTopicId }`,
        `OPTIONAL { ?courseId ${Predicates.covers} ?coversTopicId }`
    ]);
    q.run()
        .then(data => res.status(200).send(data))
        .catch(error => res.status(500).send(error));
}

export function getCourse(req, res) {
    const resourceUri = buildUri(Constants.coursesURI, req.params.id);
    const q = new Query();
    q.setProto({
        "@id": resourceUri,
        "@type": Classes.Course,
        name: predicate(Predicates.label),
        description: predicate(Predicates.description),
        abbreviation: predicate(Predicates.abbreviation),
        hasPrerequisite: {
            id: "?prereqId"
        },
        mentions: {
            id: "?mentionsTopicId"
        },
        covers: {
            id: "?coversTopicId"
        }
    });
    q.setWhere([
        `${resourceUri} ${Predicates.type} ${Classes.Course}`,
        `OPTIONAL { ${resourceUri} ${Predicates.hasPrerequisite} ?prereqId }`,
        `OPTIONAL { ${resourceUri} ${Predicates.mentions} ?mentionsTopicId }`,
        `OPTIONAL { ${resourceUri} ${Predicates.covers} ?coversTopicId }`
    ]);
    q.run()
        .then(data => res.status(emptyResult(data) ? 404 : 200).send(data[0]))
        .catch(err => res.status(500).send(err));
}
