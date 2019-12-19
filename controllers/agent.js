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

export function getAllUsers(req, res) {
    const q = new Query();
    q.setProto({
        "@id": "?userId",
        "@type": "User",
        name: predicate(Predicates.name),
        firstName: predicate(Predicates.firstName),
        lastName: predicate(Predicates.lastName),
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
        "@id": resourceUri,
        "@type": "User",
        name: predicate(Predicates.name),
        firstName: predicate(Predicates.firstName),
        lastName: predicate(Predicates.lastName),
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
            //"@type": "Team"
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
                res.status(200).send(data);
            }
        })
        .catch(err => res.status(500).send(err));
}

export async function createUser(req, res) {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.description = req.body.description;
    user.nickname = req.body.nickname;
    user.name = req.body.name;
    user.avatar = req.body.avatar;
    if (req.body.memberOf) user.memberOf = req.body.memberOf;
    user.store();
    res.send();
}

export async function createTeam(req, res) {
    const team = new Team();
    team.name = req.body.name;
    team.avatar = req.body.avatar;
    team.courseInstance = req.body.courseInstance;
    team.store();
    res.send();
}

export async function deleteUser(req, res) {
    const user = new User(buildUri(Constants.usersURI, req.params.id, false));
    await user.fetch();
    user.delete();
    res.send();
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
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.memberOf) user.memberOf = req.body.memberOf;
    user.patch();
    res.send();
}

export async function patchTeam(req, res) {
    const team = new Team(buildUri(Constants.teamsURI, req.params.id, false));
    await team.fetch();
    if (req.body.courseInstance) team.courseInstance = req.body.courseInstance;
    if (req.body.name) team.name = req.body.name;
    if (req.body.avatar) team.avatar = req.body.avatar;
    team.patch();
    res.send();
}

export async function putUser(req, res) {}
export async function putTeam(req, res) {}
