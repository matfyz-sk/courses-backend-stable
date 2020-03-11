import { orderedQuestion } from "../../constants/predicates";
import { quizTake } from "./QuizTake";
import { QuizTakePrototype } from "../../constants/classes";

export const quizTakePrototype = {
    type: QuizTakePrototype,
    subclassOf: quizTake,
    props: {
        [orderedQuestion.value]: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "orderedQuestion",
            change: "[this].createdBy.{userURI}"
        }
    }
};
