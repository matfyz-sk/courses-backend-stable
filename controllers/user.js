import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists } from "../helpers";
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

    res.status(200).send(await q.run());
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
        nickname: predicate(Predicates.nickname)
    });
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
