import { Topic } from "../constants/classes";
import { Text, Node } from "virtuoso-sparql-client";
import { name, description, hasPrerequisite, subtopicOf, hasQuestion, hasQuestionAssignment } from "../constants/predicates";

export const topic = {
    type: Topic,
    props: {
        [name.value]: { required: false, multiple: false, type: Text, primitive: true },
        [description.value]: { required: false, multiple: false, type: Text, primitive: true },
        [hasPrerequisite.value]: { required: false, multiple: false, type: Node, primitive: false },
        [subtopicOf.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasQuestion.value]: { required: false, multiple: false, type: Node, primitive: false },
        [hasQuestionAssignment.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
