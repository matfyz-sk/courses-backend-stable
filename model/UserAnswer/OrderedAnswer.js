import * as Classes from "../../constants/classes";
import { Node, Data } from "virtuoso-sparql-client";
import UserAnswer from "./UserAnswer";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class OrderedAnswer extends UserAnswer {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.orderedAnswerURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.OrderedAnswer;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.position.value] = { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true };
        this.props[Predicates.userChoice.value] = {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        };
        this.props[Predicates.predefinedAnswer.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
