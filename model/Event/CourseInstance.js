import { CourseInstance } from "../../constants/classes";
import { year, instanceOf } from "../../constants/predicates";
import { event } from "./Event";

export const courseInstance = {
    type: CourseInstance,
    subclassOf: event,
    props: {
        [year.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [instanceOf.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "course"
        }
    },
    createPolicy: ["{isAdmin}"]
};
