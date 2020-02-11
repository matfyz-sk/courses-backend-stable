import { QuizTakePrototype } from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
import { orderedQuestion } from "../constants/predicates";

export const quizTakePrototype = {
    type: QuizTakePrototype,
    props: {
        [orderedQuestion.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
