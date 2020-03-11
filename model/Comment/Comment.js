import { commentText, ofSubmission, ofQuestion, ofComment } from "../../constants/predicates";
import { Comment } from "../../constants/classes";

export const comment = {
    type: Comment,
    subclasses: ["codeComment"],
    props: {
        [commentText.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [ofSubmission.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "submission"
        },
        [ofQuestion.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "question"
        },
        [ofComment.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "comment"
        }
    }
};
