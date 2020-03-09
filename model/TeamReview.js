import { Node, Data, Text } from "virtuoso-sparql-client";
import {
    hasStudentReview,
    reviewedBy,
    percentage,
    reviewedStudent,
    studentComment,
    privateComment,
    ofSubmission
} from "../constants/predicates";
import TeamReview from "../constants/classes";

export const teamReview = {
    type: TeamReview,
    props: {
        // [hasStudentReview.value]: { required: false, multiple: false, type: Node, primitive: false },
        [reviewedBy.value]: { required: false, multiple: false, type: Node, primitive: false },
        //
        [percentage.value]: { required: false, multiple: false, type: Data, dataType: "xsd:float", primitive: true },
        [reviewedStudent.value]: { required: false, multiple: false, type: Node, primitive: false },
        [studentComment.value]: { required: false, multiple: false, type: Text, primitive: true },
        [privateComment.value]: { required: false, multiple: false, type: Text, primitive: true },
        [ofSubmission.value]: { required: true, multiple: false, type: Node, primitive: false }
    },
    createPolicy: ["ofSubmission:submittedBy:", "reviewedBy:"]
};
