import { Node } from "virtuoso-sparql-client";
import { hasQuizTakePrototype } from "../constants/predicates";
import ManualQuizAssignment from "../constants/classes";

export const manualQuizAssignment = {
    type: ManualQuizAssignment,
    props: {
        [hasQuizTakePrototype.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
