import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";
import User from "../model/Agent/User";
import Team from "../model/Agent/Team";

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

export function getAllUsers(req, res) {
    const q = new Query();
    q.setProto({
        "@id": "?userId",
        "@type": "User",
        firstName: predicate("courses:firstName"),
        lastName: predicate("courses:lastName"),
        email: predicate("courses:email"),
        description: predicate("courses:description"),
        nickname: predicate("courses:nickname"),
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
        `?userId rdf:type ${Classes.User}`,
        `OPTIONAL { ?userId courses:memberOf ?memberOfTeamId }`,
        `OPTIONAL { ?userId courses:understands ?understandsTopicId }`
    ]);

    if (req.query.requests) {
        var courseInstanceURI = buildUri(Constants.courseInstancesURI, req.query.requests);
        q.appendWhere(`?userId courses:requests ${courseInstanceURI}`);
    } else {
        q.appendWhere(`OPTIONAL { ?userId courses:requests ?requestsCourseInstanceId }`);
    }

    if (req.query.memberOf) {
        var courseInstanceURI = buildUri(Constants.teamsURI, req.query.memberOf);

        q.appendWhere(`?userId courses:memberOf ${courseInstanceURI}`);
    } else {
        q.appendWhere(`OPTIONAL { ?userId courses:memberOf ?requestsCourseInstanceId }`);
    }

    q.run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export async function getUser(req, res) {
    // const u = new User(buildUri(Constants.usersURI, req.params.id));
    // u.prepareQuery();

    const resourceUri = buildUri(Constants.usersURI, req.params.id);
    const q = new Query();
    q.setProto({
        "@id": resourceUri,
        "@type": "User",
        firstName: predicate("courses:firstName"),
        lastName: predicate("courses:lastName")
        // email: predicate(Predicates.email),
        // about: predicate(Predicates.description),
        // nickname: predicate(Predicates.nickname),
        // requests: {
        //     id: "?requestsCourseInstanceId"
        // },
        // studentOf: {
        //     id: "?studentOfCourseInstanceId"
        // },
        // memberOf: {
        //     id: "?memberOfTeamId"
        //     //"@type": "Team"
        // },
        // understands: {
        //     id: "?understandsTopicId"
        // }
    });
    q.setWhere([
        `${resourceUri} rdf:type ${Classes.User}`
        // `OPTIONAL { ${resourceUri} ${Predicates.requests} ?requestsCourseInstanceId }`,
        // `OPTIONAL { ${resourceUri} ${Predicates.studentOf} ?studentOfCourseInstanceId }`,
        // `OPTIONAL { ${resourceUri} ${Predicates.memberOf} ?memberOfTeamId }`,
        // `OPTIONAL { ${resourceUri} ${Predicates.understands} ?understandsTopicId }`
    ]);
    q.run()
        .then(data => {
            if (emptyResult(data)) {
                res.status(404).send({});
            } else {
                res.status(200).send(data);
            }
        })
        .catch(err => res.status(500).send(err));
}

export async function createUser(req, res) {
    const user = new User();
    user.firstName = req.body[Predicates.firstName.value];
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.description = req.body.description;
    user.nickname = req.body.nickname;
    user.avatar = req.body.avatar;
    // user.name = req.body.name;
    if (req.body.memberOf) user.memberOf = req.body.memberOf;
    user.store()
        .then(data => res.status(201).send(user.subject))
        .catch(err => res.status(500).send(err));
}

export async function createTeam(req, res) {
    const team = new Team();
    team.name = req.body.name;
    team.avatar = req.body.avatar;
    team.courseInstance = req.body.courseInstance;
    team.store()
        .then(data => res.status(201).send(team.subject))
        .catch(err => res.status(500).send(err));
}

export async function deleteUser(req, res) {
    const user = new User(buildUri(Constants.usersURI, req.params.id, false));
    await user.fetch();
    user.delete()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export async function deleteTeam(req, res) {
    const team = new Team(buildUri(Constants.teamsURI, req.params.id, false));
    await team.fetch();
    team.delete();
    res.send();
}

export async function patchUser(req, res) {
    const user = new User(buildUri(Constants.usersURI, req.params.id, false));
    await user.fetch();
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.memberOf) user.memberOf = req.body.memberOf;
    user.patch();
    res.send();
}

export async function patchTeam(req, res) {
    const team = new Team(buildUri(Constants.teamsURI, req.params.id, false));
    await team.fetch();
    if (req.body.name) team.name = req.body.name;
    if (req.body.courseInstance) team.courseInstance = req.body.courseInstance;
    if (req.body.avatar) team.avatar = req.body.avatar;
    team.patch();
    res.send();
}

export async function putUser(req, res) {}
export async function putTeam(req, res) {}
