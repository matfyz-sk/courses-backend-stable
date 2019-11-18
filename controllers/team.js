import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export const createTeamValidation = [
    body("name")
        .exists()
        .bail()
        .isString(),
    body("course")
        .exists()
        .bail()
        .isURL()
        .bail()
        .custom(value => resourceExists(value, Classes.CourseInstance))
];

export async function createTeam(req, res) {
    var newTeam = await getNewNode(Constants.teamsURI);
    var triples = [
        new Triple(newTeam, Predicates.type, Classes.Team),
        new Triple(newTeam, Predicates.label, new Text(req.body.name)),
        new Triple(newTeam, Predicates.course, new Node(req.body.course))
    ];
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(data => res.status(201).send(data))
        .catch(err => res.status(500).send(err));
}

export function getAllTeams(req, res) {
    const q = new Query();
    q.setProto({
        id: "?teamId",
        name: predicate(Predicates.label),
        course: {
            id: "?courseId"
        },
        members: {
            id: "?userId"
        }
    });
    q.setWhere([
        `?teamId ${Predicates.type} ${Classes.Team}`,
        `?teamId ${Predicates.course} ?courseId`,
        `OPTIONAL { ?userId ${Predicates.memberOf} ?teamId }`
    ]);
    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export async function getTeam(req, res) {
    const resourceUri = buildUri(Constants.teamsURI, req.params.id);
    const q = new Query();
    q.setProto({
        id: resourceUri,
        name: predicate(Predicates.label),
        course: {
            id: "?courseId"
        },
        members: {
            id: "?userId"
        }
    });
    q.setWhere([
        `${resourceUri} ${Predicates.type} ${Classes.Team}`,
        `${resourceUri} ${Predicates.course} ?courseId`,
        `OPTIONAL {?userId ${Predicates.memberOf} ${resourceUri} }`
    ]);
    q.run()
        .then(data => {
            if (emptyResult(data)) {
                res.status(404).json({});
            } else {
                res.status(200).json(data[0]);
            }
        })
        .catch(err => res.status(500).send(err));
}
