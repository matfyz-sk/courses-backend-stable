import { Task } from "../../constants/classes";
import { Node } from "virtuoso-sparql-client";
import { courseInstance, covers, mentions, requires } from "../../constants/predicates";

export const task = {
    type: Task,
    subclasses: ["assignment", "questionAssignment", "quizAssignment"],
    props: {
        [covers.value]: { required: false, multiple: true, type: Node, primitive: false },
        [mentions.value]: { required: false, multiple: true, type: Node, primitive: false },
        [requires.value]: { required: false, multiple: true, type: Node, primitive: false },
        [courseInstance.value]: { required: false, multiple: true, type: Node, primitive: false }
    },
    createPolicy: ["courseInstance:^instructorOf:{userURI}"]
};
