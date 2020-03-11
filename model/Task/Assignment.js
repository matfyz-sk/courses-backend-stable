import {
    hasField,
    submissionAnonymousSubmission,
    submissionImprovedSubmission,
    teamsDisabled,
    teamsSubmittedAsTeam,
    teamsMinimumInTeam,
    teamsMaximumInTeam,
    teamsMultipleSubmissions,
    reviewsDisabled,
    reviewsPerSubmission,
    reviewedByTeam,
    reviewsVisibility,
    teamReviewsDisabled,
    initialSubmissionPeriod,
    peerReviewPeriod,
    improvedSubmissionPeriod,
    teamReviewPeriod,
    shortDescription,
    hasDocument
} from "../../constants/predicates";
import { Assignment } from "../../constants/classes";
import { task } from "./Task";

export const assignment = {
    type: Assignment,
    subclassOf: task,
    props: {
        [shortDescription.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [hasDocument.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "document"
        },
        [hasField.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "field"
        },
        [submissionAnonymousSubmission.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [initialSubmissionPeriod.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod"
        },
        [submissionImprovedSubmission.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [improvedSubmissionPeriod.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod"
        },
        [teamsDisabled.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [teamsSubmittedAsTeam.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [teamsMinimumInTeam.value]: {
            required: false,
            multiple: false,
            dataType: "integer"
        },
        [teamsMaximumInTeam.value]: {
            required: false,
            multiple: false,
            dataType: "integer"
        },
        [teamsMultipleSubmissions.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [peerReviewPeriod.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod"
        },
        [reviewsDisabled.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [reviewsPerSubmission.value]: {
            required: false,
            multiple: false,
            dataType: "integer"
        },
        [reviewedByTeam.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [reviewsVisibility.value]: {
            required: false,
            multiple: false,
            type: "string"
        },
        [teamReviewsDisabled.value]: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        [teamReviewPeriod.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "assignmentPeriod"
        }
    }
};
