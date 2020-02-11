import { Topic } from "../constants/classes";
import { Text } from "virtuoso-sparql-client";
import { name, description } from "../constants/predicates";

export const topic = {
    type: Topic,
    props: {
        [name.value]: { required: false, multiple: false, type: Text, primitive: true },
        [description.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
