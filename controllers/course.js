import { body } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export async function createCourse(req, res) {
    const newCourse = await getNewNode(Constants.coursesURI);
    var triples = [
        new Triple(newCourse, Predicates.type, Classes.Course),
        new Triple(newCourse, Predicates.label, new Text(req.body.name)),
        new Triple(newCourse, Predicates.description, new Text(req.body.description)),
        new Triple(newCourse, Predicates.abbreviation, new Text(req.body.abbreviation))
    ];
    for (var courseURI of req.body.hasPrerequisite) {
        triples.push(new Triple(newCourse, Predicates.hasPrerequisite, new Node(courseURI)));
    }
    for (var topicURI of req.body.mentions) {
        triples.push(new Triple(newCourse, Predicates.mentions, new Node(topicURI)));
    }
    for (var topicURI of req.body.covers) {
        triples.push(new Triple(newCourse, Predicates.covers, new Node(topicURI)));
    }
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(data => res.status(201).send(newCourse))
        .catch(err => res.status(500).send(err));
}

export function getAllCourses(req, res) {
    const q = new Query();
    q.setProto({
        "@id": "?courseId",
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
        `?courseId ${Predicates.type} ${Classes.Course}`,
        `OPTIONAL { ?courseId ${Predicates.hasPrerequisite} ?prereqId }`,
        `OPTIONAL { ?courseId ${Predicates.mentions} ?mentionsTopicId }`,
        `OPTIONAL { ?courseId ${Predicates.covers} ?coversTopicId }`
    ]);
    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
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
