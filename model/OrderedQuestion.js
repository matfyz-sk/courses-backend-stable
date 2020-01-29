import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class OrderedQuestion extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.OrderedQuestion;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.orderedQuestionURI;
        this.predicates.push(
            { predicate: Predicates.question, asNode: true },
            { predicate: Predicates.userAnswer, asNode: true },
            { predicate: Predicates.quizTake, asNode: true },
            { predicate: Predicates.next, asNode: true }
        );
    }

    set question(value) {
        this._setProperty(Predicates.question, new Node(value));
    }

    set userAnswer(value) {
        this._setProperty(Predicates.userAnswer, new Node(value));
    }

    set quizTake(value) {
        this._setProperty(Predicates.quizTake, new Node(value));
    }

    set next(value) {
        this._setProperty(Predicates.next, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.question, new Node(data.question));
        this._setNewProperty(Predicates.userAnswer, new Node(data.userAnswer));
        this._setNewProperty(Predicates.quizTake, new Node(data.quizTake));
        this._setNewProperty(Predicates.next, new Node(data.next));
        super._fill(data);
    }
}
