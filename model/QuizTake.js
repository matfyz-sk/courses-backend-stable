import { QuizTake } from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import { startDate, endDate, submitedDate, reviewedDate, hasAuthor } from "../constants/predicates";

export const quizTake = {
    type: QuizTake,
    props: {
        [startDate.value]: { required: false, multiple: false, type: Text, primitive: true },
        [endDate.value]: { required: false, multiple: false, type: Text, primitive: true },
        [submitedDate.value]: { required: false, multiple: false, type: Text, primitive: true },
        [reviewedDate.value]: { required: false, multiple: false, type: Text, primitive: true },
        [hasAuthor.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
