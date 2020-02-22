import { Data, Node } from "virtuoso-sparql-client";
import { amount, topic } from "../constants/predicates";
import TopicAppearance from "../constants/classes";

export const topicAppearance = {
    type: TopicAppearance,
    props: {
        [amount.value]: { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true },
        [topic.value]: { required: false, multiple: false, type: Node, primitive: false }
    }
};
