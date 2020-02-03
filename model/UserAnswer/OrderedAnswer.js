import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import UserAnswer from "./UserAnswer";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class OrderedAnswer extends UserAnswer {
    constructor(uri) {
        super(uri);
        this.type = Classes.OrderedAnswer;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.orderedAnswerURI;
        this.predicates.push(
            { predicate: Predicates.position, asNode: false },
            { predicate: Predicates.userChoice, asNode: false },
            { predicate: Predicates.predefinedAnswer, asNode: true }
        );
    }

    set position(value) {
        this._setProperty(Predicates.position, new Data(value, "xsd:integer"));
    }

    set userChoice(value) {
        this._setProperty(Predicates.userChoice, new Data(value, "xsd:boolean"));
    }

    set predefinedAnswer(value) {
        this._setProperty(Predicates.predefinedAnswer, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.position, new Data(data.position, "xsd:integer"));
        this._setNewProperty(Predicates.userChoice, new Data(data.userChoice, "xsd:boolean"));
        this._setNewProperty(Predicates.predefinedAnswer, new Node(data.predefinedAnswer));
        super._fill(data);
    }
}
