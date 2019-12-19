import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import Session from "./Session";

export default class Lecture extends Session {
    constructor() {
        super();
        this._uri = "";
        this._type = "courses:Lecture";
        this._subclassOf = "courses:Session";
        this._prefix = "http://www.courses.matfyz.sk/data/lecture/";
        this._old = {};
    }
    set room(value) {
        if (this._room) {
            this._old._room = this._room;
        }
        this._room = value;
    }
    store() {
        // testing
        const newNode = new Node(this._prefix + "12345");

        var triples = [
            new Triple(newNode, Predicates.type, this._type),
            new Triple(newNode, Predicates.subclassOf, this._subclassOf),
            new Triple(newNode, Predicates.room, new Text(this._room))
        ];
        return super.store(newNode, triples);
    }
    _fill(data) {
        this._old._room = data[Constants.ontologyURI + "room"];
        super._fill(data);
    }
}
