import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import QuestionVersion from "./QuestionVersion";

export default class QuestionWithPreddefinedAnswer extends QuestionVersion {
    constructor(uri) {
        super(uri);
        this.type = Classes.QuestionWithPreddefinedAnswer;
        this.subclassOf = Classes.QuestionVersion;
        this.uriPrefix = Constants.questionWithPreddefinedAnswerURI;
    }

    set hasAnswer(value) {
        this._setProperty(Predicates.hasAnswer, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.hasAnswer, new Node(data.hasAnswer));
        super._fill(data);
    }
}
