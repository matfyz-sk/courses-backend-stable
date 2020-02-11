import { Node, Text } from "virtuoso-sparql-client";
import { CourseInstance } from "../../constants/classes";
import { year, instanceOf, hasInstructor } from "../../constants/predicates";
import { event } from "./Event";

export const courseInstance = {
    type: CourseInstance,
    subclassOf: event,
    props: {
        [year.value]: { required: false, multiple: false, type: Text, primitive: true },
        [instanceOf.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasInstructor.value]: { required: false, multiple: true, type: Node, primitive: false }
    }
};
