import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Question from "./Question";

export default class OpenQuestion extends Question {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.openQuestionURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.OpenQuestion;
        this.subclassOf = Classes.Question;
        this.props[Predicates.regexp.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
