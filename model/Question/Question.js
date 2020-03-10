import { Question, Topic, User, QuestionComment, ChangeEvent } from "../../constants/classes";
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
            objectClass: Topic
        },
        [hasAuthor.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: User
        },
        [hasComment.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: QuestionComment
        },
        [approver.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: User
        },
        [hasChangeEvent.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: ChangeEvent
        }
    },
    createPolicy: ["ofTopic:^covers/assignedTo:{userURI}"]
};
