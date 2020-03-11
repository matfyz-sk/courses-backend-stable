import { creationPeriod, assignedTo } from "../../constants/predicates";
import { QuestionAssignment } from "../../constants/classes";
import { task } from "./Task";

export const questionAssignment = {
    type: QuestionAssignment,
    subclassOf: task,
    props: {
        [creationPeriod.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "taskEvent"
        },
        [assignedTo.value]: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "user"
        }
    }
};
