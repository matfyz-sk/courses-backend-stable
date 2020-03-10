import { QuestionWithPreddefinedAnswer, UserAnswer } from "../../constants/classes";
import { question } from "./Question";
import { hasAnswer } from "../../constants/predicates";

export const questionWithPredefinedAnswer = {
    type: QuestionWithPreddefinedAnswer,
    subclassOf: question,
    props: {
        [hasAnswer.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: UserAnswer
        }
    }
};
