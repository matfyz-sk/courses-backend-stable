// import { QuestionComment, User, Question } from "../constants/classes";
// import { Node, Text } from "virtuoso-sparql-client";
// import { commentText, hasAuthor, created, ofQuestion } from "../constants/predicates";

// export const questionComment = {
//     type: QuestionComment,
//     props: {
//         [commentText.value]: {
//             required: true,
//             multiple: false,
//             dataType: "string",
//             change: "[this].hasAuthor.{userURI}"
//         },
//         [hasAuthor.value]: {
//             required: true,
//             multiple: false,
//             dataType: "node",
//             objectClass: User,
//             fillOnCreate: true
//         },
//         [created.value]: {
//             required: false,
//             multiple: false,
//             dataType: "dateTime",
//             fillOnCreate: true
//         },
//         [ofQuestion.value]: {
//             required: true,
//             multiple: false,
//             dataType: "node",
//             objectClass: Question
//         }
//     },
//     createPolicy: ["ofQuestion:ofTopic/^covers/courseInstance/^instructorOf|^studentOf:{userURI}"]
// };
