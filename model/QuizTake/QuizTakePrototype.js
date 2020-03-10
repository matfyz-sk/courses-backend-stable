import { orderedQuestion } from "../../constants/predicates";
import { quizTake } from "./QuizTake";
import { QuizTakePrototype, OrderedQuestion } from "../../constants/classes";

export const quizTakePrototype = {
    type: QuizTakePrototype,
    subclassOf: quizTake,
    props: {
        [orderedQuestion.value]: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: OrderedQuestion,
            change: "[this].createdBy.{userURI}"
        }
    }
};
