import * as Classes from "../../constants/classes";
import { Node, Data } from "virtuoso-sparql-client";
import Thing from "../Thing";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class UserAnswer extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.userAnswerURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.UserAnswer;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.score.value] = { required: false, multiple: false, type: Data, dataType: "xsd:float", primitive: true };
        this.props[Predicates.orderedQuestion.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
