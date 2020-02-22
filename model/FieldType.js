import { Text } from "virtuoso-sparql-client";
import { label, value } from "../constants/predicates";
import FieldType from "../constants/classes";

export const fieldType = {
    type: FieldType,
    props: {
        [label.value]: { required: false, multiple: false, type: Text, primitive: true },
        [value.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
