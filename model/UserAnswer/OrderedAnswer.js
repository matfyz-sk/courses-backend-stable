import { OrderedAnswer } from "../../constants/classes";
import { position, userChoice, predefinedAnswer } from "../../constants/predicates";
import { userAnswer } from "./UserAnswer";

export const orderedAnswer = {
    type: OrderedAnswer,
    subclassOf: userAnswer,
    props: {
        [position.value]: {
            required: true,
            multiple: false,
            dataType: "integer"
        },
        [userChoice.value]: {
            required: true,
            multiple: false,
            dataType: "boolean"
        },
        [predefinedAnswer.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "predefinedAnswer"
        }
    }
};
