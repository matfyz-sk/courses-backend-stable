import { OrderedQuestion, Question, UserAnswer } from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
import { question, userAnswer, quizTake, next } from "../constants/predicates";

export const orderedQuestion = {
    type: OrderedQuestion,
    props: {
        [question.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: Question,
            change: "[this].createdBy.{userURI}"
        },
        [userAnswer.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: UserAnswer,
            change: "[this].createdBy.{userURI}"
        },
        // [quizTake.value]: {
        //     required: false,
        //     multiple: false,
        //     type: Node,
        //     primitive: false
        // },
        [next.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: OrderedQuestion,
            change: "[this].createdBy.{userURI}"
        }
    },
    create: ""
};
