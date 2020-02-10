import { Node } from "virtuoso-sparql-client";
import { courseInstance } from "../../constants/predicates";
import { agent } from "./Agent";
import { Team } from "../../constants/classes";

export const team = {
    type: Team,
    subclassOf: agent,
    props: {
        [courseInstance.value]: {
            required: false,
            multiple: false,
            type: Node,
            primitive: false
        }
    }
};
