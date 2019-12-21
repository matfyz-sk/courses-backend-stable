import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class Topic extends Thing {
    constructor(uri) {
        super();
        this.type = Classes.Topic;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.topicURI;
    }

    set name(value) {
        this._setProperty(Predicates.name, new Text(value));
    }

    set description(value) {
        this._setProperty(Predicates.description, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.name, new Text(data.name));
        this._setNewProperty(Predicates.description, new Text(data.description));
        super._fill(data);
    }
}
