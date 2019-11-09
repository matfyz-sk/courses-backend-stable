import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate } from "../helpers";
import { db } from "../config/client";

export async function createCourse(req, res) {
    const newCourse = await getNewNode(Constants.coursesURI);
    var triples = [
        new Triple(newCourse, Predicates.type, "courses:Course"),
        new Triple(newCourse, Predicates.label, new Text(req.body.name)),
        new Triple(newCourse, Predicates.description, new Text(req.body.about)),
        new Triple(newCourse, Predicates.abbreviation, new Text(req.body.abbreviation))
    ];
    if (req.body.hasPrerequisite != null) {
        for (var p of req.body.hasPrerequisite) {
            triples.push(new Triple(newCourse, Predicates.hasPrerequisite, new Node(p)));
        }
    }
    if (req.body.mentions != null) {
        for (var p of req.body.mentions) {
            triples.push(new Triple(newCourse, Predicates.mentions, new Node(p)));
        }
    }
    if (req.body.covers != null) {
        for (var p of req.body.covers) {
            triples.push(new Triple(newCourse, Predicates.covers, new Node(p)));
        }
    }
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
}

export async function getAllCourses(req, res) {
    const q = new Query();
    q.setProto({
        id: "?courseId",
        name: "$courses:name$required",
        about: "$courses:about$required",
        abbreviation: "$courses:abbreviation$required",
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
        `?courseId ${Predicates.type} courses:Course`,
        `OPTIONAL { ?courseId ${Predicates.hasPrerequisite} ?prereqId }`,
        `OPTIONAL { ?courseId ${Predicates.mentions} ?mentionsTopicId }`,
        `OPTIONAL { ?courseId ${Predicates.covers} ?coversTopicId }`
    ]);
    res.status(200).send(await q.run());
}

export async function getCourse(req, res) {
    const resourceUri = buildUri(Constants.coursesURI, req.params.id);
    const q = new Query();
    q.setProto({
        id: resourceUri,
        name: "$courses:name$required",
        about: "$courses:about$required",
        abbreviation: "$courses:abbreviation$required",
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
        `${resourceUri} ${Predicates.type} courses:Course`,
        `OPTIONAL { ${resourceUri} ${Predicates.hasPrerequisite} ?prereqId }`,
        `OPTIONAL { ${resourceUri} ${Predicates.mentions} ?mentionsTopicId }`,
        `OPTIONAL { ${resourceUri} ${Predicates.covers} ?coversTopicId }`
    ]);
    const data = await q.run();
    if (JSON.stringify(data) == "{}") {
        res.status(404).send({});
    } else {
        res.status(200).send(data);
    }
}
