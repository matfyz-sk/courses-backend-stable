import { UserAnswer } from "../../constants/classes";
import { Node, Data } from "virtuoso-sparql-client";
import { score, orderedQuestion } from "../../constants/predicates";

export const userAnswer = {
    type: UserAnswer,
    props: {
        [score.value]: { required: false, multiple: false, type: Data, dataType: "xsd:float", primitive: true },
        [orderedQuestion.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
