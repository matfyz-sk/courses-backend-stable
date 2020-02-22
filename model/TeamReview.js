import { Node } from "virtuoso-sparql-client";
import { hasStudentReview, reviewedBy } from "../constants/predicates";
import TeamReview from "../constants/classes";

export const teamReview = {
    type: TeamReview,
    props: {
        [hasStudentReview.value]: { required: false, multiple: false, type: Node, primitive: false },
        [reviewedBy.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
