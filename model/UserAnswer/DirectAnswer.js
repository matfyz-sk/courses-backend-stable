import { DirectAnswer } from "../../constants/classes";
import { text } from "../../constants/predicates";
import { userAnswer } from "./UserAnswer";

export const directAnswer = {
    type: DirectAnswer,
    subclassOf: userAnswer,
    props: {
        [text.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        }
    }
};
