import { body, param } from "express-validator";
import Query from "../query/Query";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, resourceExists, prepareQueryUri, emptyResult } from "../helpers";
import Topic from "../model/Topic";

export const idValidation = [param("id").custom(value => resourceExists(value, Classes.Topic))];

export async function createTopic(req, res) {
    const topic = new Topic();
    topic.name = req.body.name;
    topic.description = req.body.description;
    topic.hasPrerequisite = req.body.hasPrerequisite;
    topic.subtopicOf = req.body.subtopicOf;
    topic
        .store()
        .then(data => res.status(201).send(topic.subject))
        .catch(err => res.status(500).send(err));
}

export function deleteTopic(req, res) {
    const topic = new Topic(buildUri(Constants.topicURI, req.params.id));
    topic
        .fetch()
        .then(data => {
            topic._fill(topic.prepareData(data));
            topic.delete();
        })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export async function patchTopic(req, res) {
    const topic = new Topic(buildUri(Constants.topicURI, req.params.id));
    topic
        .fetch()
        .then(data => {
            topic._fill(topic.prepareData(data));
            if (req.body.name) topic.name = req.body.name;
            if (req.body.description) topic.description = req.body.description;
            if (req.body.hasPrerequisite) topic.hasPrerequisite = req.body.hasPrerequisite;
            if (req.body.subtopicOf) topic.subtopicOf = req.body.subtopicOf;
            topic.patch();
        })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export async function putTopic(req, res) {}

export async function getAllTopics(req, res) {
    const q = new Query();
    q.setProto({
        "@id": "?topicId",
        "@type": Classes.Topic,
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
    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export async function getTopic(req, res) {
    const resourceUri = buildUri(Constants.topicURI, req.params.id);
    const q = new Query();
    q.setProto({
        "@id": resourceUri,
        "@type": Classes.Topic,
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
        `${resourceUri} ${Predicates.type} ${Classes.Topic}`,
        `OPTIONAL {${resourceUri} ${Predicates.hasPrerequisite} ?prereqId}`,
        `OPTIONAL {${resourceUri} ${Predicates.subtopicOf} ?subtopicId}`
    ]);
    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}
