import * as Classes from "../constants/classes";
import { GeneralComment } from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import { creator, commentTime, commentText } from "../constants/predicates";

export const generalComment = {
    type: GeneralComment,
    props: {
        [creator.value]: { required: false, multiple: false, type: Node, primitive: false },
        [commentTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        [commentText.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
