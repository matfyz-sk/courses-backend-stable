import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import Event from "../Event";

export default class Session extends Event {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.sessionURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Session;
        this.subclassOf = Classes.Event;
    }

    set courseInstance(value) {
        this._setProperty(Predicates.courseInstance, new Node(value));
    }

    set hasInstructor(value) {
        this._setArrayProperty(Predicates.hasInstructor, value, Node);
    }

    _fill(data) {
        this._setNewProperty(Predicates.courseInstance, new Node(data.courseInstance));
        this._setNewArrayProperty(Predicates.hasInstructor, data.hasInstructor, Node);
        super._fill(data);
    }
}
