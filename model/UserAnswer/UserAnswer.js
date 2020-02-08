import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
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
        this.uriPrefix = Constants.userAnswerURI;
        this.predicates.push(
            { predicate: Predicates.score, asNode: false, required: false, multiple: false },
            { predicate: Predicates.orderedQuestion, asNode: true, required: true, multiple: false }
        );
    }

    set score(value) {
        this._setProperty(Predicates.score, new Data(value, "xsd:float"));
    }

    set orderedQuestion(value) {
        this._setProperty(Predicates.orderedQuestion, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.score, new Data(data.score, "xsd:float"));
        this._setNewProperty(Predicates.orderedQuestion, new Node(data.orderedQuestion));
        super._fill(data);
    }
}
