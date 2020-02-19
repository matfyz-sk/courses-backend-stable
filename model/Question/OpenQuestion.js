import { Text } from "virtuoso-sparql-client";
import { regexp } from "../../constants/predicates";
import { OpenQuestion } from "../../constants/classes";
import { question } from "./Question";

export const openQuestion = {
    type: OpenQuestion,
    subclassOf: question,
    subclasses: [],
    props: {
        [regexp.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
