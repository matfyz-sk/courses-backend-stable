import { Task } from "../../constants/classes";
import { courseInstance, covers, mentions, requires, name, description } from "../../constants/predicates";

export const task = {
    type: Task,
    subclasses: ["assignment", "questionAssignment", "quizAssignment"],
    props: {
        [name.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [description.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [covers.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        },
        [mentions.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        },
        [requires.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        },
        [courseInstance.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance"
        }
    },
    createPolicy: ["courseInstance.^courses:instructorOf.{userURI}"]
};
