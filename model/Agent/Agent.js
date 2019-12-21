import * as Classes from "../../constants/classes";
import Thing from "../Thing";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class Agent extends Thing {
    constructor(uri) {
        super(uri);
    }

    set name(value) {
        this._setProperty(Predicates.name, new Text(value));
    }

    set avatar(value) {
        this._setProperty(Predicates.avatar, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.name, data.name);
        this._setNewProperty(Predicates.avatar, data.avatar);
        super._fill(data);
    }
}
