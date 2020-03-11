import { assignedTo, hasQuizTake, hasAuthor, takingEvent } from "../../../constants/predicates";
import QuizAssignment from "../../../constants/classes";
import { task } from "../Task";

export const quizAssignment = {
    type: QuizAssignment,
    subclassOf: task,
    subclasses: ["generatedQuizAssignment", "manualQuizAssignment"],
    props: {
        [assignedTo.value]: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "user"
        },
        [hasQuizTake.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "quizTake"
        },
        [hasAuthor.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "user"
        },
        [takingEvent.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "taskEvent"
        }
    }
};
