import { QuizTake, QuizAssignment, User } from "../../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import { startDate, endDate, submitedDate, reviewedDate, hasAuthor, ofQuizAssignment } from "../../constants/predicates";

export const quizTake = {
    type: QuizTake,
    subclasses: ["quizTakePrototype"],
    props: {
        // [submitedDate.value]: {
        //     required: false,
        //     multiple: false,
        //     type: Text,
        //     primitive: true
        // },
        [reviewedDate.value]: {
            required: false,
            multiple: false,
            dataType: "dateTime",
            change: "[this].ofQuizAssignment/courseInstance/^instructorOf.{userURI}"
        },
        // [hasAuthor.value]: {
        //     required: false,
        //     multiple: false,
        //     dataType: "node",
        //     objectClass:User,
        //     fillOnCreate: true
        // },
        [ofQuizAssignment.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: QuizAssignment
        }
    },
    create: "[this].ofQuizAssignment/assignedTo.{userURI}"
};
