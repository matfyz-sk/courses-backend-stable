import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Question from "./Question";

export default class QuestionWithPredefinedAnswer extends Question {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.questionWithPreddefinedAnswerURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.QuestionWithPreddefinedAnswer;
        this.subclassOf = Classes.Question;
        this.props[Predicates.hasAnswer.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
