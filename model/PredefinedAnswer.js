import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class PredefinedAnswer extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.predefinedAnswerURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.PredefinedAnswer;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.predefinedAnswerURI;
        this.predicates.push(
            { predicate: Predicates.text, asNode: false, required: true, multiple: false },
            { predicate: Predicates.position, asNode: false, required: true, multiple: false },
            { predicate: Predicates.correct, asNode: false, required: true, multiple: false }
        );
    }

    set text(value) {
        this._setProperty(Predicates.text, new Text(value));
    }

    set position(value) {
        this._setProperty(Predicates.position, new Data(value, "xsd:integer"));
    }

    set correct(value) {
        this._setProperty(Predicates.correct, new Data(value, "xsd:boolean"));
    }

    _fill(data) {
        this._setNewProperty(Predicates.text, new Text(data.text));
        this._setNewProperty(Predicates.position, new Data(data.position, "xsd:integer"));
        this._setNewProperty(Predicates.correct, new Data(data.correct, "xsd:boolean"));
        super._fill(data);
    }
}
