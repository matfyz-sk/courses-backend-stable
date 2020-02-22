import { Text, Node } from "virtuoso-sparql-client";
import { field, value } from "../constants/predicates";
import SubmittedField from "../constants/classes";

export const subbmittedField = {
    type: SubmittedField,
    props: {
        [field.value]: { required: false, multiple: false, type: Node, primitive: false },
        [value.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
