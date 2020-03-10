import { regexp } from "../../constants/predicates";
import { OpenQuestion } from "../../constants/classes";
import { question } from "./Question";

export const openQuestion = {
    type: OpenQuestion,
    subclassOf: question,
    props: {
        [regexp.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        }
    }
};
