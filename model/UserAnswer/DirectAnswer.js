import { DirectAnswer } from "../../constants/classes";
import { Text } from "virtuoso-sparql-client";
import { text } from "../../constants/predicates";
import { userAnswer } from "./UserAnswer";

export const directAnswer = {
    type: DirectAnswer,
    subclassOf: userAnswer,
    props: {
        [text.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
