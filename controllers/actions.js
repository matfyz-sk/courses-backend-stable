import User from "../model/Agent/User";
import * as Predicates from "../constants/predicates";

export function requestCourseInstance(req, res) {
    const user = new User(req.body.userURI);
    user.fetch()
        .then(data => {
            user._appendToArrayProperty(Predicates.requests, new Node(req.body.courseInstance));
            user.store();
        })
        .then(data => res.status(201).send())
        .catch(err => res.status(500).send());
}
