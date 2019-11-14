import { body, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate } from "../helpers";
import { db } from "../config/client";

export const createTopicValidation = [
    body("name")
        .exists()
        .isString(),
    body("description").exists(),
    body("hasPrerequisite")
        .optional()
        .isArray(),
    body("hasPrerequisite.*").isURL(),
    body("subtopicOf")
        .optional()
        .isURL()
];

export async function createTopic(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const topicNode = await getNewNode(Constants.topicURI);

    var triples = [
        new Triple(topicNode, Predicates.type, Classes.Topic),
        new Triple(topicNode, Predicates.label, new Text(req.body.name)),
        new Triple(topicNode, Predicates.description, new Text(req.body.description))
    ];
    if (req.body.hasPrerequisite) {
        for (var p of req.body.hasPrerequisite) {
            triples.push(new Triple(topicNode, Predicates.hasPrerequisite, new Node(p)));
        }
    }
    if (req.body.subtopicOf) triples.push(new Triple(topicNode, Predicates.subtopicOf, new Node(req.body.subtopicOf)));

    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
}

export async function getAllTopics(req, res) {
    const q = new Query();
    q.setProto({
        id: "?topicId",
        name: predicate(Predicates.label),
        description: predicate(Predicates.description),
        hasPrerequisite: {
            id: "?prereqId"
        },
        subtopicOf: {
            id: "?subtopicId"
        }
    });
    q.setWhere([
        `?topicId ${Predicates.type} ${Classes.Topic}`,
        `OPTIONAL {?topicId ${Predicates.hasPrerequisite} ?prereqId}`,
        `OPTIONAL {?topicId ${Predicates.subtopicOf} ?subtopicId}`
    ]);
    res.status(200).send(await q.run());
}

export async function getTopic(req, res) {
    const data = await findById(req.params.id);
    if (JSON.stringify(data) == "{}") {
        res.status(404).json({});
        return;
    }
    res.status(200).send(data[0]);
}

export async function deleteTopic(req, res) {
    const data = await findById(req.params.id);
    if (JSON.stringify(data) == "{}") {
        res.status(404).json({});
        return;
    }
    const uri = buildUri(Constants.topicURI, req.params.id);
    var triples = [];
    triples.push(new Triple(uri, Predicates.label, new Text(data[0].name), Triple.REMOVE));
    triples.push(new Triple(uri, Predicates.description, new Text(data[0].description), Triple.REMOVE));
    if (Array.isArray(data[0].hasPrerequisite)) {
        for (var p of data[0].hasPrerequisite) {
            triples.push(new Triple(uri, Predicates.hasPrerequisite, new Node(p.id), Triple.REMOVE));
        }
    } else if (data[0].hasPrerequisite.id) {
        triples.push(new Triple(uri, Predicates.hasPrerequisite, new Node(data[0].hasPrerequisite.id), Triple.REMOVE));
    }
    if (data[0].subtopicOf.id) {
        triples.push(new Triple(uri, Predicates.subtopicOf, new Node(data[0].subtopicOf.id), Triple.REMOVE));
    }
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
}

export async function patchTopic(req, res) {
    const data = await findById(req.params.id);
    if (JSON.stringify(data) == "{}") {
        res.status(404).json({});
        return;
    }
    const uri = buildUri(Constants.topicURI, req.params.id);
    var triples = [];
    var tmp;
    if (req.body.name) {
        tmp = new Triple(uri, Predicates.label, new Text(data[0].name));
        tmp.updateObject(new Text(req.body.name));
        triples.push(tmp);
    }
    if (req.body.description) {
        tmp = new Triple(uri, Predicates.description, new Text(data[0].description));
        tmp.updateObject(new Text(req.body.description));
        triples.push(tmp);
    }
    if (req.body.hasPrerequisite) {
        for (var p of req.body.hasPrerequisite) {
            tmp = new Triple(uri, Predicates.hasPrerequisite, new Text(data[0].description));
            tmp.updateObject(new Text(req.body.description));
        }
    }
    if (triples.length == 0) {
        res.status(200).send("OK");
        return;
    }
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json(err));
}

export async function putTopic(req, res) {}

async function findById(topicId) {
    const uri = buildUri(Constants.topicURI, topicId);
    const q = new Query();
    q.setProto({
        id: uri,
        name: predicate(Predicates.label),
        description: predicate(Predicates.description),
        hasPrerequisite: {
            id: "?prereqId"
        },
        subtopicOf: {
            id: "?subtopicId"
        }
    });
    q.setWhere([
        `${uri} ${Predicates.type} ${Classes.Topic}`,
        `OPTIONAL {${uri} ${Predicates.hasPrerequisite} ?prereqId}`,
        `OPTIONAL {${uri} ${Predicates.subtopicOf} ?subtopicId}`
    ]);
    const data = await q.run();
    return data;
}