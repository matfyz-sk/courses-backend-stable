import { UserAnswer } from "../../constants/classes";
import { score, orderedQuestion } from "../../constants/predicates";

export const userAnswer = {
    type: UserAnswer,
    subclasses: ["directAnswer", "orderedAnswer"],
    props: {
        [score.value]: {
            required: false,
            multiple: false,
            dataType: "float"
        },
        [orderedQuestion.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "orderedQuestion"
        }
    }
};
