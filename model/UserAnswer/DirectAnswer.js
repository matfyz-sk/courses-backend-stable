import * as Classes from "../../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import UserAnswer from "./UserAnswer";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class DirectAnswer extends UserAnswer {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.directAnswerURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.DirectAnswer;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.text.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
