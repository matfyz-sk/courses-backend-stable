import { QuestionComment } from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import { commentText, hasAuthor, created, ofQuestion } from "../constants/predicates";

export const questionComment = {
    type: QuestionComment,
    props: {
        [commentText.value]: { required: false, multiple: false, type: Text, primitive: true },
        [hasAuthor.value]: { required: true, multiple: false, type: Node, primitive: false },
        [created.value]: { required: false, multiple: false, type: Text, primitive: true },
        [ofQuestion.value]: { required: true, multiple: false, type: Node, primitive: false }
    },
    createPolicy: ["ofQuestion:ofTopic/^covers/courseInstance/^instructorOf|^studentOf:{userURI}"]
};
