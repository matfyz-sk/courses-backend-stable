import { Node, Text } from "virtuoso-sparql-client";
import { description, elaborates, creationPeriod, assignedTo } from "../../constants/predicates";
import { QuestionAssignment } from "../../constants/classes";
import { task } from "./Task";

export const questionAssignment = {
    type: QuestionAssignment,
    subclassOf: task,
    props: {
        [description.value]: { required: false, multiple: false, type: Text, primitive: true },
        [elaborates.value]: { required: false, multiple: false, type: Node, primitive: false },
        [creationPeriod.value]: { required: false, multiple: false, type: Node, primitive: false },
        [assignedTo.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
