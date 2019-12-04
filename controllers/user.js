import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

// prettier-ignore
export const createUserValidation = [
    body("name")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isString().withMessage(Messages.FIELD_NOT_STRING),
    body("surname")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isString().withMessage(Messages.FIELD_NOT_STRING),
    body("email")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isEmail().withMessage(Messages.FIELD_NOT_EMAIL),
    body("description").exists().withMessage(Messages.MISSING_FIELD),
    body("nickname").exists().withMessage(Messages.MISSING_FIELD)
];

// prettier-ignore
export const requestCourseInstanceValidation = [
    body("user")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isURL()
        .custom(value => resourceExists(value, Classes.User)),
    body("courseInstance")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isURL()
        .custom(value => resourceExists(value, Classes.CourseInstance))
];

export const setTeamValidation = [
    body("user")
        .exists()
        .bail()
        .isURL()
        .bail()
        .custom(value => resourceExists(value, Classes.User)),
    body("team")
        .exists()
        .bail()
        .isURL()
        .bail()
        .custom(value => resourceExists(value, Classes.Team))
];

export const idValidation = [
    param("id")
        .exists()
        .bail()
        .custom(value => resourceExists(value, Classes.User))
];

export async function createUser(req, res) {
    var newUser = await getNewNode(Constants.usersURI);
    var triples = [
        new Triple(newUser, Predicates.type, Classes.User),
        new Triple(newUser, Predicates.name, new Text(req.body.name)),
        new Triple(newUser, Predicates.surname, new Text(req.body.surname)),
        new Triple(newUser, Predicates.email, new Text(req.body.email)),
        new Triple(newUser, Predicates.description, new Text(req.body.description)),
        new Triple(newUser, Predicates.nickname, new Text(req.body.nickname))
    ];
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(201).send(newUser))
        .catch(err => res.status(500).send(err));
}

export async function getAllUsers(req, res) {
    const q = new Query();
    q.setProto({
        id: "?userId",
        name: predicate(Predicates.name),
        surname: predicate(Predicates.surname),
        email: predicate(Predicates.email),
        description: predicate(Predicates.description),
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
        `?userId ${Predicates.type} ${Classes.User}`,
        `OPTIONAL { ?userId ${Predicates.memberOf} ?memberOfTeamId }`,
        `OPTIONAL { ?userId ${Predicates.understands} ?understandsTopicId }`
    ]);

    if (req.query.requests) {
        var courseInstanceURI = buildUri(Constants.courseInstancesURI, req.query.requests);
        q.appendWhere(`?userId ${Predicates.requests} ${courseInstanceURI}`);
    } else {
        q.appendWhere(`OPTIONAL { ?userId ${Predicates.requests} ?requestsCourseInstanceId }`);
    }

    if (req.query.studentOf) {
        var courseInstanceURI = buildUri(Constants.courseInstancesURI, req.query.studentOf);
        q.appendWhere(`?userId ${Predicates.studentOf} ${courseInstanceURI}`);
    } else {
        q.appendWhere(`OPTIONAL { ?userId ${Predicates.studentOf} ?requestsCourseInstanceId }`);
    }

    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export async function getUser(req, res) {
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
            if (emptyResult(data)) {
                res.status(404).send({});
            } else {
                res.status(200).send(data[0]);
            }
        })
        .catch(err => res.status(500).send(err));
}

export async function deleteUser(req, res) {
    const resourceUri = buildUri(Constants.usersURI, req.params.id);
    var triples = [];

    // db.query(
    //     "PREFIX courses: <http://www.courses.matfyz.sk/ontology#> select <http://www.courses.matfyz.sk/user/Li4aO> ?p ?o where {<http://www.courses.matfyz.sk/user/Li4aO> ?p ?o}"
    // ).then(data => res.status(200).send(data));

    const q = new Query();
    q.setProto({
        id: resourceUri,
        predicate: "?predicate",
        object: "?object"
    });
    q.setWhere([`${resourceUri} ?predicate ?object`]);
    var data = await q.run();

    if (emptyResult(data)) return res.status(200).send();

    data = data[0];

    console.log(data);

    data.predicate.forEach((item, index) => {
        triples.push(new Triple(resourceUri, new Node(item), new Node(data.object[index])));
    });

    console.log(triples);

    res.status(200).send(data);

    // const q = new Query();
    // q.setProto({
    //     sub: "?sub",
    //     pred: "?pred",
    //     obj: "?obj"
    //     // id: resourceUri,
    //     // name: predicate(Predicates.name),
    //     // surname: predicate(Predicates.surname),
    //     // email: predicate(Predicates.email),
    //     // about: predicate(Predicates.description),
    //     // nickname: predicate(Predicates.nickname),
    //     // requests: {
    //     //     id: "?requestsCourseInstanceId"
    //     // },
    //     // studentOf: {
    //     //     id: "?studentOfCourseInstanceId"
    //     // },
    //     // memberOf: {
    //     //     id: "?memberOfTeamId"
    //     // },
    //     // understands: {
    //     //     id: "?understandsTopicId"
    //     // }
    // });
    // q.setWhere([
    //     "?sub ?pred ?obj"`${resourceUri} ${Predicates.type} ${Classes.User}`,
    //     `OPTIONAL { ${resourceUri} ${Predicates.requests} ?requestsCourseInstanceId }`,
    //     `OPTIONAL { ${resourceUri} ${Predicates.studentOf} ?studentOfCourseInstanceId }`,
    //     `OPTIONAL { ${resourceUri} ${Predicates.memberOf} ?memberOfTeamId }`,
    //     `OPTIONAL { ${resourceUri} ${Predicates.understands} ?understandsTopicId }`
    // ]);

    // q.run()
    //     .then(data => {
    //         if (emptyResult(data)) {
    //             res.status(404).send({});
    //         } else {
    //             res.status(200).send(data[0]);
    //         }
    //     })
    //     .catch(err => res.status(500).send(err));
}

export async function requestCourseInstance(req, res) {
    const q = new Query();
    q.setProto({ id: prepareQueryUri(req.body.user), type: predicate(Predicates.type) });
    q.setWhere([`${prepareQueryUri(req.body.user)} ${Predicates.requests} ${prepareQueryUri(req.body.courseInstance)}`]);
    q.run()
        .then(data => {
            if (emptyResult(data)) {
                var triple = new Triple(new Node(req.body.user), Predicates.requests, new Node(req.body.courseInstance));
                db.getLocalStore().add(triple);
                db.store(true)
                    .then(result => res.status(201).send())
                    .catch(err => res.status(500).send(err));
            } else {
                res.status(400).send("User already requesting course instance");
            }
        })
        .catch(err => res.status(500).send(err));
}

export function setCourseInstance(req, res) {
    var triple = new Triple(new Node(req.body.user), Predicates.studentOf, new Node(req.body.courseInstance));
    db.getLocalStore().add(triple);
    db.store(true)
        .then(data => res.status(201).send())
        .catch(err => res.status(500).send(err));
}

export async function setTeam(req, res) {
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
