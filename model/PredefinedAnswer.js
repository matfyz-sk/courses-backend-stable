import { PredefinedAnswer } from "../constants/classes";
import { Text, Data } from "virtuoso-sparql-client";
import { text, position, correct } from "../constants/predicates";

export const predefinedAnswer = {
    type: PredefinedAnswer,
    props: {
        [text.value]: { required: false, multiple: false, type: Text, primitive: true },
        [position.value]: { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true },
        [correct.value]: { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true }
    }
};
