import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class PreddefinedAnswer extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.PreddefinedAnswer;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.preddefinedAnswerURI;
    }

    set text(value) {
        this._setProperty(Predicates.text, new Text(value));
    }

    set position(value) {
        this._setProperty(Predicates.position, new Data(value, "xsd:integer"));
    }

    set correctnes(value) {
        this._setProperty(Predicates.correctnes, new Data(value, "xsd:boolean"));
    }

    set answer(value) {
        this._setProperty(Predicates.answer, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.text, new Text(data.text));
        this._setNewProperty(Predicates.position, new Data(data.position, "xsd:integer"));
        this._setNewProperty(Predicates.correctnes, new Data(data.correctnes, "xsd:boolean"));
        this._setNewProperty(Predicates.answer, new Node(data.answer));
        super._fill(data);
    }
}
