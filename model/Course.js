import { Course } from "../constants/classes";
import { name, description, abbreviation, hasPrerequisite, mentions, covers } from "../constants/predicates";

export const course = {
    type: Course,
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
        [abbreviation.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [hasPrerequisite.value]: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "course"
        },
        [mentions.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        },
        [covers.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        }
    },
    createPolicy: ["{isSuperAdmin}"]
};
