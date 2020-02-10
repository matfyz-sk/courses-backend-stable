import { Agent } from "../../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import { name, avatar, reviews } from "../../constants/predicates";

export const agent = {
    type: Agent,
    props: {
        [name.value]: {
            required: false,
            multiple: false,
            type: Text,
            primitive: true
        },
        [avatar.value]: {
            required: false,
            multiple: false,
            type: Text,
            primitive: true
        },
        [reviews.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        }
    }
};
