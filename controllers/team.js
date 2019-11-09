import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate } from "../helpers";
import { db } from "../config/client";

export const createTeamValidation = [
    body("name")
        .exists()
        .isString(),
    body("course")
        .exists()
        .isURL()
];

export async function createTeam(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // TODO check if course instance exists
    var newTeam = await getNewNode(Constants.teamsURI);
    var triples = [
        new Triple(newTeam, Predicates.type, Classes.Team),
        new Triple(newTeam, Predicates.label, new Text(req.body.name)),
        new Triple(newTeam, Predicates.course, new Node(req.body.course))
    ];
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
}

export async function getAllTeams(req, res) {
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
    res.status(200).send(await q.run());
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
    const data = await q.run();
    if (JSON.stringify(data) == "{}") {
        res.status(404).json({});
    } else {
        res.status(200).json(data[0]);
    }
}
