import { Node, Text } from "virtuoso-sparql-client";
import { extraTime, task } from "../../../constants/predicates";
import { TaskEvent } from "../../../constants/classes";
import { event } from "../Event";

export const taskEvent = {
    type: TaskEvent,
    subclassOf: event,
    props: {
        [extraTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        [task.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
