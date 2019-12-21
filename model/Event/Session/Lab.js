import * as Classes from "../../../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Session from "./Session";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";

export default class Lab extends Session {
    constructor(uri) {
        super(uri);
        this.type = Classes.Lab;
        this.subclassOf = Classes.Session;
        this.uriPrefix = Constants.labURI;
    }

    set room(value) {
        this._setProperty(Predicates.room, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.room, new Text(data.room));
        super._fill(data);
    }
}
