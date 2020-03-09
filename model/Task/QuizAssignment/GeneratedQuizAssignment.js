import { Node } from "virtuoso-sparql-client";
import { hasTopicAppearance } from "../../../constants/predicates";
import GeneratedQuizAssignment from "../../../constants/classes";
import { quizAssignment } from "./QuizAssignment";

export const generatedQuizAssignment = {
    type: GeneratedQuizAssignment,
    subclassOf: quizAssignment,
    props: {
        [hasTopicAppearance.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
