import { Node, Text } from "virtuoso-sparql-client";
import { name, description, assignedTo, hasQuizTake, hasAuthor, takingEvent } from "../../../constants/predicates";
import QuizAssignment from "../../../constants/classes";
import { task } from "../Task";

export const quizAssignment = {
    type: QuizAssignment,
    subclassOf: task,
    subclasses: ["generatedQuizAssignment", "manualQuizAssignment"],
    props: {
        [name.value]: { required: false, multiple: false, type: Text, primitive: true },
        [description.value]: { required: false, multiple: false, type: Text, primitive: true },
        [assignedTo.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasQuizTake.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasAuthor.value]: { required: false, multiple: false, type: Node, primitive: false },
        [takingEvent.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
