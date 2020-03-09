import { Node, Text, Data } from "virtuoso-sparql-client";
import {
    courseInstance,
    createdBy,
    infoName,
    infoDescription,
    infoShortDescription,
    infoDocuments,
    hasField,
    submissionAnonymousSubmission,
    submissionOpenTime,
    submissionDeadline,
    submissionExtraTime,
    submissionImprovedSubmission,
    submissionImprovedDeadline,
    submissionImprovedExtraTime,
    submissionImprovedOpenTime,
    teamsDisabled,
    teamsSubmittedAsTeam,
    teamsMinimumInTeam,
    teamsMaximumInTeam,
    teamsMultipleSubmissions,
    reviewsDisabled,
    reviewsDeadline,
    reviewsExtraTime,
    reviewsPerSubmission,
    reviewsOpenTime,
    reviewedByTeam,
    reviewsVisibility,
    reviewsQuestions,
    teamReviewsDisabled,
    teamReviewsDeadline,
    teamReviewsExtraTime,
    teamReviewsOpenTime,
    initialSubmissionPeriod,
    peerReviewPeriod,
    improvedSubmissionPeriod,
    teamReviewPeriod,
    hasAuthor
} from "../../constants/predicates";
import { Assignment } from "../../constants/classes";
import { task } from "./Task";

export const assignment = {
    type: Assignment,
    subclassOf: task,
    props: {
        [hasAuthor.value]: { required: false, multiple: false, type: Node, primitive: false },
        [infoName.value]: { required: false, multiple: false, type: Text, primitive: true },
        [infoDescription.value]: { required: false, multiple: false, type: Text, primitive: true },
        [infoShortDescription.value]: { required: false, multiple: false, type: Text, primitive: true },
        [infoDocuments.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasField.value]: { required: false, multiple: false, type: Node, primitive: false },
        [submissionAnonymousSubmission.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true },

        // [submissionOpenTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        // [submissionDeadline.value]: { required: false, multiple: false, type: Text, primitive: true },
        // [submissionExtraTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        [initialSubmissionPeriod.value]: { required: false, multiple: false, type: Node, primitive: false },

        [submissionImprovedSubmission.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true },

        // [submissionImprovedOpenTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        // [submissionImprovedDeadline.value]: { required: false, multiple: false, type: Text, primitive: true },
        // [submissionImprovedExtraTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        [improvedSubmissionPeriod.value]: { required: false, multiple: false, type: Node, primitive: false },

        [teamsDisabled.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true },
        [teamsSubmittedAsTeam.value]: { required: false, multiple: false, type: Text, primitive: true },
        [teamsMinimumInTeam.value]: { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true },
        [teamsMaximumInTeam.value]: { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true },
        [teamsMultipleSubmissions.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true },

        // [reviewsDisabled.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true },
        // [reviewsOpenTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        // [reviewsDeadline.value]: { required: false, multiple: false, type: Text, primitive: true },
        [peerReviewPeriod.value]: { required: false, multiple: false, type: Node, primitive: false },

        [reviewsExtraTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        [reviewsPerSubmission.value]: { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true },
        [reviewedByTeam.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true },
        [reviewsVisibility.value]: { required: false, multiple: false, type: Text, primitive: true },
        [reviewsQuestions.value]: { required: false, multiple: false, type: Node, primitive: false },
        [teamReviewsDisabled.value]: { required: false, multiple: false, type: Data, dataType: "xsd:boolean", primitive: true },

        // [teamReviewsOpenTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        // [teamReviewsDeadline.value]: { required: false, multiple: false, type: Text, primitive: true },
        // [teamReviewsExtraTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        [teamReviewPeriod.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
