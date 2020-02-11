import { OrderedQuestion } from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
import { question, userAnswer, quizTake, next } from "../constants/predicates";

export const orderedQuestion = {
    type: OrderedQuestion,
    props: {
        [question.value]: { required: false, multiple: false, type: Node, primitive: false },
        [userAnswer.value]: { required: false, multiple: false, type: Node, primitive: false },
        [quizTake.value]: { required: false, multiple: false, type: Node, primitive: false },
        [next.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
