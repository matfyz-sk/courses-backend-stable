import { Task, Topic, CourseInstance } from "../../constants/classes";
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
            objectClass: Topic
        },
        [mentions.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Topic
        },
        [requires.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Topic
        },
        [courseInstance.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: CourseInstance
        }
    },
    createPolicy: ["courseInstance.^courses:instructorOf.{userURI}"]
};
