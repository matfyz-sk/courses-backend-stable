import * as Constants from "../constants";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, validateRequestBody, predicate } from "../helpers";
import { createUserRequest } from "../constants/schemas";
import * as Predicates from "../constants/predicates";
import Query from "../query/Query";
import { Client, Node, Text, Data, Triple } from "virtuoso-sparql-client";
import express from "express";

const router = express.Router();

const db = new Client(Constants.virtuosoEndpoint);
db.addPrefixes({
    courses: Constants.ontologyURI
});
db.setQueryFormat("application/json");
db.setQueryGraph(Constants.graphURI);
db.setDefaultGraph(Constants.graphURI);

router.get("/", async (req, res) => {
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
});

router.post("/", async (req, res) => {
    const name = req.body.name;
    const desc = req.body.description;
    const hasPrereq = req.body.hasPrerequisite;
    const subtopicOf = req.body.subtopicOf;

    const topicNode = await getNewNode(Constants.topicURI);

    var triples = [
        new Triple(topicNode, Predicates.type, Classes.Topic),
        new Triple(topicNode, Predicates.label, new Text(name)),
        new Triple(topicNode, Predicates.description, new Text(desc))
    ];
    if (hasPrereq) {
        for (var p of hasPrereq) {
            triples.push(new Triple(topicNode, Predicates.hasPrerequisite, new Node(p)));
        }
    }
    if (subtopicOf) triples.push(new Triple(topicNode, Predicates.subtopicOf, new Node(subtopicOf)));

    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
});

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

router.get("/:id", async (req, res) => {
    const data = await findById(req.params.id);
    if (JSON.stringify(data) == "{}") {
        res.status(404).json({});
        return;
    }
    res.status(200).send(data[0]);
});

router.delete("/:id", async (req, res) => {
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
});

router.patch("/:id", async (req, res) => {
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
});

router.put("/:id", async (req, res) => {});

exports.topicsRouter = router;
