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
import TeamReview, { Submission, User } from "../constants/classes";

export const teamReview = {
    type: TeamReview,
    props: {
        [reviewedBy.value]: {
            required: true,
            multiple: false,
            type: "node",
            objectClass: User,
            change: "{isAdmin}"
        },
        [percentage.value]: {
            required: true,
            multiple: false,
            dataType: "float",
            change: "ofSubmission.ofAssignment/courseInstance/^instructorOf.{userURI}"
        },
        [reviewedStudent.value]: {
            required: true,
            multiple: false,
            type: "node",
            objectClass: User,
            change: "{isAdmin}"
        },
        [studentComment.value]: {
            required: false,
            multiple: false,
            type: "string",
            change: "ofSubmission.ofAssignment/courseInstance/^instructorOf.{userURI}"
        },
        [privateComment.value]: {
            required: false,
            multiple: false,
            type: "string",
            change: "ofSubmission.ofAssignment/courseInstance/^instructorOf.{userURI}"
        },
        [ofSubmission.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: Submission,
            change: "{isAdmin}"
        }
    },
    createPolicy: ["ofSubmission:submittedBy:", "reviewedBy:"]
};
