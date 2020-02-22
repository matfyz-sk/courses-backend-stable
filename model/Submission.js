import { Data, Text, Node } from "virtuoso-sparql-client";
import {
    ofAssignment,
    submittedField,
    submittedByStudent,
    submittedByTeam,
    submittedAt,
    hasReview,
    hasTeacherComment,
    hasCodeReview,
    hasTeamReview,
    isComplete
} from "../constants/predicates";
import Submission from "../constants/classes";

export const submission = {
    type: Submission,
    props: {
        [ofAssignment.value]: { required: false, multiple: false, type: Node, primitive: false },
        [submittedField.value]: { required: false, multiple: false, type: Node, primitive: false },
        [submittedByStudent.value]: { required: false, multiple: false, type: Node, primitive: false },
        [submittedByTeam.value]: { required: false, multiple: false, type: Node, primitive: false },
        [submittedAt.value]: { required: false, multiple: false, type: Text, primitive: true },
        [hasReview.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasTeacherComment.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasCodeReview.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasTeamReview.value]: { required: false, multiple: false, type: Node, primitive: false },
        [isComplete.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true }
    }
};
