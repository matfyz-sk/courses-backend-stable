import { creationPeriod, assignedTo } from "../../constants/predicates";
import { QuestionAssignment, TaskEvent, User } from "../../constants/classes";
import { task } from "./Task";

export const questionAssignment = {
    type: QuestionAssignment,
    subclassOf: task,
    props: {
        [creationPeriod.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: TaskEvent
        },
        [assignedTo.value]: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: User
        }
    }
};
