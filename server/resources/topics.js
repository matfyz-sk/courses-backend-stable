import * as Constants from "../constants";
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
        `?topicId ${Predicates.type} courses:Topic`,
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
        new Triple(topicNode, Predicates.type, "courses:Topic"),
        new Triple(topicNode, Predicates.label, new Text(name)),
        new Triple(topicNode, Predicates.description, new Text(desc))
    ];
    if (hasPrereq) triples.push(new Triple(topicNode, Predicates.hasPrerequisite, new Node(hasPrereq)));
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
        `${uri} ${Predicates.type} courses:Topic`,
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
exports.topicsRouter = router;
