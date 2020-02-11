import { Node, Text } from "virtuoso-sparql-client";
import { Event } from "../../constants/classes";
import { name, location, description, startDate, endDate, uses, recommends, covers, mentions, requires } from "../../constants/predicates";

export const event = {
    type: Event,
    props: {
        [name.value]: { required: false, multiple: false, type: Text, primitive: true },
        [location.value]: { required: false, multiple: false, type: Text, primitive: true },
        [description.value]: { required: false, multiple: false, type: Text, primitive: true },
        [startDate.value]: { required: false, multiple: false, type: Text, primitive: true },
        [endDate.value]: { required: false, multiple: false, type: Text, primitive: true },
        [uses.value]: { required: false, multiple: true, type: Node, primitive: false },
        [recommends.value]: { required: false, multiple: true, type: Node, primitive: false },
        [covers.value]: { required: false, multiple: true, type: Node, primitive: false },
        [mentions.value]: { required: false, multiple: true, type: Node, primitive: false },
        [requires.value]: { required: false, multiple: true, type: Node, primitive: false }
    }
};
