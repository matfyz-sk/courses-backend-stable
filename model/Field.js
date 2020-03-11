import { name, description, ofType } from "../constants/predicates";
import Field from "../constants/classes";

export const field = {
    type: Field,
    props: {
        [name.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [description.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [ofType.value]: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "fieldType"
        }
    }
};
