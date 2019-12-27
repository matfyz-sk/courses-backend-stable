import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Thing from "../Thing";

export default class Task extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.Task;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.taskURI;
    }

    set covers(value) {
        this._setArrayProperty(Predicates.covers, value, Node);
    }

    set mentions(value) {
        this._setArrayProperty(Predicates.mentions, value, Node);
    }

    set requires(value) {
        this._setArrayProperty(Predicates.requires, value, Node);
    }

    _fill(data) {
        this._setNewArrayProperty(Predicates.covers, data.covers, Node);
        this._setNewArrayProperty(Predicates.mentions, data.mentions, Node);
        this._setNewArrayProperty(Predicates.requires, data.requires, Node);
        super._fill(data);
    }
}
