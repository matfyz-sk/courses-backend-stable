import { OrderedAnswer } from "../../constants/classes";
import { Node, Data } from "virtuoso-sparql-client";
import { position, userChoice, predefinedAnswer } from "../../constants/predicates";
import { userAnswer } from "./UserAnswer";

export const orderedAnswer = {
    type: OrderedAnswer,
    subclassOf: userAnswer,
    props: {
        [position.value]: { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true },
        [userChoice.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        },
        [predefinedAnswer.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
