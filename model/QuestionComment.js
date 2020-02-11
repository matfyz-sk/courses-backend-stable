import { QuestionComment } from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import { commentText, hasAuthor, created } from "../constants/predicates";

export const questionComment = {
    type: QuestionComment,
    props: {
        [commentText.value]: { required: false, multiple: false, type: Text, primitive: true },
        [hasAuthor.value]: { required: false, multiple: false, type: Node, primitive: false },
        [created.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
