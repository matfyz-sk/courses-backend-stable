import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class DirectAnswer extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.DirectAnswer;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.directAnswerURI;
    }

    set text(value) {
        this._setProperty(Predicates.text, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.text, new Text(data.text));
        super._fill(data);
    }
}
