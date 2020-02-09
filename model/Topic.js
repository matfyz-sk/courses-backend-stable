import * as Classes from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class Topic extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.topicURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Topic;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.name.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.description.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
