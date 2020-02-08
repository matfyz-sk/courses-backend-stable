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
        this.uriPrefix = Constants.questionWithPreddefinedAnswerURI;
        this.predicates.push({ predicate: Predicates.hasAnswer, asNode: true, required: true, multiple: false });
    }

    set hasAnswer(value) {
        this._setProperty(Predicates.hasAnswer, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.hasAnswer, new Node(data.hasAnswer));
        super._fill(data);
    }
}
