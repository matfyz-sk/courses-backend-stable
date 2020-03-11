import { label, value } from "../constants/predicates";
import FieldType from "../constants/classes";

export const fieldType = {
    type: FieldType,
    props: {
        [label.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [value.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        }
    }
};
