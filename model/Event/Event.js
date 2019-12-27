import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Thing from "../Thing";

export default class Event extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.Event;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.eventsURI;
    }

    set name(value) {
        this._setProperty(Predicates.name, new Text(value));
    }

    set location(value) {
        this._setProperty(Predicates.location, new Text(value));
    }

    set description(value) {
        this._setProperty(Predicates.description, new Text(value));
    }

    set startDate(value) {
        this._setProperty(Predicates.startDate, new Text(value));
    }

    set endDate(value) {
        this._setProperty(Predicates.endDate, new Text(value));
    }

    set uses(value) {
        this._setArrayProperty(Predicates.uses, value, Node);
    }

    set recommends(value) {
        this._setArrayProperty(Predicates.recommends, value, Node);
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
        this._setNewProperty(Predicates.name, new Text(data.name));
        this._setNewProperty(Predicates.location, new Text(data.location));
        this._setNewProperty(Predicates.description, new Text(data.description));
        this._setNewProperty(Predicates.startDate, new Text(data.startDate));
        this._setNewProperty(Predicates.endDate, new Text(data.endDate));

        this._setNewArrayProperty(Predicates.uses, data.uses, Node);
        this._setNewArrayProperty(Predicates.recommends, data.recommends, Node);
        this._setNewArrayProperty(Predicates.covers, data.covers, Node);
        this._setNewArrayProperty(Predicates.mentions, data.mentions, Node);
        this._setNewArrayProperty(Predicates.requires, data.requires, Node);

        super._fill(data);
    }
}
