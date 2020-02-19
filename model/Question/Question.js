import { Question } from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import {
    name,
    text,
    visibilityIsRestricted,
    hasQuestionState,
    ofTopic,
    hasAuthor,
    hasComment,
    approver,
    hasChangeEvent
} from "../../constants/predicates";

export const question = {
    type: Question,
    subclasses: ["essayQuestion", "openQuestion", "questionWithPredefinedAnswer"],
    props: {
        [name.value]: { required: false, multiple: false, type: Text, primitive: true },
        [text.value]: { required: false, multiple: false, type: Text, primitive: true },
        [visibilityIsRestricted.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        },
        [hasQuestionState.value]: { required: false, multiple: false, type: Text, primitive: true },
        [ofTopic.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasAuthor.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasComment.value]: { required: false, multiple: true, type: Node, primitive: false },
        [approver.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasChangeEvent.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
