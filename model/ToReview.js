import { Node } from "virtuoso-sparql-client";
import { submission, assignment, user, team } from "../constants/predicates";
import ToReview from "../constants/classes";

export const toReview = {
    type: ToReview,
    props: {
        [submission.value]: { required: false, multiple: false, type: Node, primitive: false },
        [assignment.value]: { required: false, multiple: false, type: Node, primitive: false },
        [user.value]: { required: false, multiple: false, type: Node, primitive: false },
        [team.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
