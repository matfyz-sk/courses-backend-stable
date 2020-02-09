import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "../Thing";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class Question extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.questionURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Question;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.name.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.text.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.visibilityIsRestricted.value] = {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        };
        this.props[Predicates.hasQuestionState.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.ofTopic.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.hasAuthor.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.hasComment.value] = { required: false, multiple: true, type: Node, primitive: false };
        this.props[Predicates.approver.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.hasChangeEvent.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
