import * as Constants from "../constants";
import User from "../model/Agent/User";
import { buildUri } from "../helpers";
import Team from "../model/Agent/Team";
import Course from "../model/Course";

function putResource(resource, req, res) {
    resource
        .fetch()
        .then(data => {
            resource._fill(resource.prepareData(data));
            for (var p of resource.predicates) {
                if (req.body[p.predicate.value]) resource[p.predicate.value] = req.body[p.predicate.value];
            }
            resource.removeOld = false;
            resource.put();
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            res.status(500).send(error);
        });
}

export function putUser(req, res) {
    const user = new User(buildUri(Constants.usersURI, req.params.id, false));
    putResource(user, req, res);
}

export function putTeam(req, res) {
    const team = new Team(buildUri(Constants.teamsURI, req.params.id, false));
    putResource(team, req, res);
}

export function putCourse(req, res) {
    const course = new Course(buildUri(Constants.coursesURI, req.params.id, false));
    putResource(course, req, res);
}
