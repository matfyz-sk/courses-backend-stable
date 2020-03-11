import { hasQuizTakePrototype } from "../../../constants/predicates";
import ManualQuizAssignment from "../../../constants/classes";
import { quizAssignment } from "./QuizAssignment";

export const manualQuizAssignment = {
    type: ManualQuizAssignment,
    subclassOf: quizAssignment,
    props: {
        [hasQuizTakePrototype.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "quizTakePrototype"
        }
    }
};
