import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class Question extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.Question;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.questionURI;
    }

    set about(value) {
        this._setProperty(Predicates.about, new Node(value));
    }

    set author(value) {
        this._setProperty(Predicates.author, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.about, new Node(data.about));
        this._setNewProperty(Predicates.author, new Node(data.author));
        super._fill(data);
    }
}
