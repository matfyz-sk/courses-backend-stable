import { extraTime, task } from "../../../constants/predicates";
import { TaskEvent } from "../../../constants/classes";
import { event } from "../Event";

export const taskEvent = {
    type: TaskEvent,
    subclassOf: event,
    subclasses: ["assignmentPeriod", "examinationEvent"],
    props: {
        [extraTime.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [task.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "task"
        }
    }
};
