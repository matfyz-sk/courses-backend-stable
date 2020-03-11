import { Question } from "../../constants/classes";
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
        [name.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [text.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [visibilityIsRestricted.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [hasQuestionState.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [ofTopic.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "topic"
        },
        [hasAuthor.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "user"
        },
        [hasComment.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "questionComment"
        },
        [approver.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user"
        },
        [hasChangeEvent.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "changeEvent"
        }
    },
    createPolicy: ["ofTopic:^covers/assignedTo:{userURI}"]
};
