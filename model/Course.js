import { Course } from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import { name, description, abbreviation, hasPrerequisite, mentions, covers } from "../constants/predicates";

export const course = {
    type: Course,
    props: {
        [name.value]: { required: false, multiple: false, type: Text, primitive: true },
        [description.value]: { required: false, multiple: false, type: Text, primitive: true },
        [abbreviation.value]: { required: false, multiple: false, type: Text, primitive: true },
        [hasPrerequisite.value]: { required: false, multiple: true, type: Node, primitive: false },
        [mentions.value]: { required: false, multiple: true, type: Node, primitive: false },
        [covers.value]: { required: false, multiple: true, type: Node, primitive: false }
    }
};
