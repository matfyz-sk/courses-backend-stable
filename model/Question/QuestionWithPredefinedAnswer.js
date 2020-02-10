import { QuestionWithPreddefinedAnswer } from "../../constants/classes";
import { question } from "./Question";
import { Node } from "virtuoso-sparql-client";
import { hasAnswer } from "../../constants/predicates";

export const questionWithPredefinedAnswer = {
    type: QuestionWithPreddefinedAnswer,
    subclassOf: question,
    props: {
        [hasAnswer.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
