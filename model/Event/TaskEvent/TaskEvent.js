import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import Event from "../Event";

export default class TaskEvent extends Event {
    constructor(uri) {
        super(uri);
    }

    set extraTime(value) {
        this._setProperty(Predicates.extraTime, new Text(value));
    }

    set task(value) {
        this._setProperty(Predicates.task, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.extraTime, new Text(data.extraTime));
        this._setNewProperty(Predicates.task, new Node(data.task));
        super._fill(data);
    }
}
