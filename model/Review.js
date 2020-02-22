import { Text, Node } from "virtuoso-sparql-client";
import { hasQuestionAnswer, reviewedByStudent, reviewedByTeam, submittedAt } from "../constants/predicates";
import Review from "../constants/classes";

export const review = {
    type: Review,
    props: {
        [hasQuestionAnswer.value]: { required: false, multiple: false, type: Node, primitive: false },
        [reviewedByStudent.value]: { required: false, multiple: false, type: Node, primitive: false },
        [reviewedByTeam.value]: { required: false, multiple: false, type: Node, primitive: false },
        [submittedAt.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
