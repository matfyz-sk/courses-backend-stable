import { Node } from "virtuoso-sparql-client";
import { Session } from "../../../constants/classes";
import { courseInstance, hasInstructor } from "../../../constants/predicates";
import { event } from "../Event";

export const session = {
    type: Session,
    subclassOf: event,
    subclasses: ["lecture", "lab"],
    props: {
        // [courseInstance.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasInstructor.value]: { required: false, multiple: true, type: Node, primitive: false }
    }
};
