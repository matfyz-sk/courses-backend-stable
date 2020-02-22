import { Data, Node, Text } from "virtuoso-sparql-client";
import { name, description, ofType } from "../constants/predicates";
import Field from "../constants/classes";

export const field = {
    type: Field,
    props: {
        [name.value]: { required: false, multiple: false, type: Text, primitive: true },
        [description.value]: { required: false, multiple: false, type: Text, primitive: true },
        [ofType.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
