import { Node } from "virtuoso-sparql-client";
import { hasTopicAppearance } from "../constants/predicates";
import GeneratedQuizAssignment from "../constants/classes";

export const generatedQuizAssignment = {
    type: GeneratedQuizAssignment,
    props: {
        [hasTopicAppearance.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
