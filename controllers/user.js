import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export const createUserValidation = [
    body("name")
        .exists()
        .isString(),
    body("surname")
        .exists()
        .isString(),
    body("email")
        .exists()
        .isEmail(),
    body("description").exists(),
    body("nickname").exists()
];

export const requestCourseInstanceValidation = [
    body("user")
        .exists()
        .isURL()
        .custom(value => resourceExists(value, Classes.User)),
    body("courseInstance")
        .exists()
        .isURL()
        .custom(value => resourceExists(value, Classes.CourseInstance))
];

export const setTeamValidation = [
    body("user")
        .exists()
        .isURL()
        .custom(value => resourceExists(value, Classes.User)),
    body("team")
        .exists()
        .isURL()
        .custom(value => resourceExists(value, Classes.Team))
];

export const idValidation = [
    param("id")
        .exists()
        .isString()
];

export async function createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var newUser = await getNewNode(Constants.usersURI);
    var triples = [
        new Triple(newUser, Predicates.type, Classes.User),
        new Triple(newUser, Predicates.name, new Text(req.body.name)),
        new Triple(newUser, Predicates.surname, new Text(req.body.surname)),
        new Triple(newUser, Predicates.email, new Text(req.body.email)),
        new Triple(newUser, Predicates.description, new Text(req.body.about)),
        new Triple(newUser, Predicates.nickname, new Text(req.body.nickname))
    ];
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
}

export async function getAllUsers(req, res) {
    const q = new Query();
    q.setProto({
        id: "?userId",
        name: predicate(Predicates.name),
        surname: predicate(Predicates.surname),
        email: predicate(Predicates.email),
        about: predicate(Predicates.description),
        nickname: predicate(Predicates.nickname)
    });
    q.setWhere([`?userId ${Predicates.type} ${Classes.User}`]);

    q.run()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

export async function getUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const resourceUri = buildUri(Constants.usersURI, req.params.id);
    const q = new Query();
    q.setProto({
        id: resourceUri,
        name: predicate(Predicates.name),
        surname: predicate(Predicates.surname),
        email: predicate(Predicates.email),
        about: predicate(Predicates.description),
        nickname: predicate(Predicates.nickname),
        requests: {
            id: "?requestsCourseInstanceId"
        },
        studentOf: {
            id: "?studentOfCourseInstanceId"
        },
        memberOf: {
            id: "?memberOfTeamId"
        },
        understands: {
            id: "?understandsTopicId"
        }
    });
    q.setWhere([
        `${resourceUri} ${Predicates.type} ${Classes.User}`,
        `OPTIONAL { ${resourceUri} ${Predicates.requests} ?requestsCourseInstanceId }`,
        `OPTIONAL { ${resourceUri} ${Predicates.studentOf} ?studentOfCourseInstanceId }`,
        `OPTIONAL { ${resourceUri} ${Predicates.memberOf} ?memberOfTeamId }`,
        `OPTIONAL { ${resourceUri} ${Predicates.understands} ?understandsTopicId }`
    ]);

    q.run()
        .then(data => {
            if (JSON.stringify(data) == "[]") {
                res.status(404).send({});
            } else {
                res.status(200).send(data[0]);
            }
        })
        .catch(err => res.status(500).send(err));
}

export async function requestCourseInstance(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const q = new Query();
    q.setProto({ id: prepareQueryUri(req.body.user), type: predicate(Predicates.type) });
    q.setWhere([`${prepareQueryUri(req.body.user)} ${Predicates.requests} ${prepareQueryUri(req.body.courseInstance)}`]);

    q.run()
        .then(data => {
            if (JSON.stringify(data) == "{}") {
                var triple = new Triple(new Node(req.body.user), Predicates.requests, new Node(req.body.courseInstance));
                db.getLocalStore().add(triple);
                db.store(true)
                    .then(result => res.status(200).send(result))
                    .catch(err => res.status(500).send(err));
            } else {
                res.status(400).send("User already requesting course instance");
            }
        })
        .catch(err => res.status(500).send(err));
}

export async function setCourseInstance(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var user = prepareQueryUri(req.body.user);
    var courseInstance = prepareQueryUri(req.body.courseInstance);

    res.status(200).send();
}

export async function setTeam(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const user = prepareQueryUri(req.body.user);
    const team = prepareQueryUri(req.body.team);

    const q = new Query();
    q.setProto({ id: user, type: predicate(Predicates.type) });
    q.setWhere([`${user} ${Predicates.memberOf} ${team}`]);
    q.run()
        .then(data => {
            if (!emptyResult(data)) {
                return res.status(400).send(`User is already a member of the team ${req.body.team}`);
            }
            db.getLocalStore().add(new Triple(new Node(req.body.user), Predicates.memberOf, new Node(req.body.team)));
            db.store(true)
                .then(result => res.status(201).send(result))
                .catch(err => res.status(500).send(err));
        })
        .catch(err => res.status(500).send(err));
}
