import { Agent } from "../../constants/classes";
import { name, avatar } from "../../constants/predicates";

export const agent = {
    type: Agent,
    subclasses: ["user", "team"],
    props: {
        [name.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [avatar.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        }
    }
};
