import * as Classes from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class OrderedQuestion extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.orderedQuestionURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.OrderedQuestion;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.question.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.userAnswer.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.quizTake.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.next.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
