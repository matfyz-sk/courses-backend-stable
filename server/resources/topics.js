import * as Constants from "../constants";
import { buildUri, getNewNode, validateRequestBody } from "../helpers";
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
        name: "$rdfs:label",
        description: "$courses:description",
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

exports.topicsRouter = router;
