import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import Event from "./Event";

export default class Session extends Event {
    constructor() {
        super();
        this._uri = "";
        this._type = "courses:Session";
        this._subclassOf = "courses:Event";
        this._prefix = "http://www.courses.matfyz.sk/data/session/";
        this._old = {};
    }
    set hasInstructor(value) {
        if (this._hasInstructor) {
            this._old._hasInstructor = this._hasInstructor;
        }
        this._hasInstructor = value;
    }
    delete(subject, triples) {
        triples.push(new Triple(subject, Predicates.hasInstructor, new Node(this._old._hasInstructor), Triple.REMOVE));

        super.delete(subject, triples);
    }
    update(subject, triples) {
        var t1 = new Triple(subject, Predicates.hasInstructor, new Text(this._old._hasInstructor));
        t1.updateObject(new Text(this._hasInstructor));
        triples.push(t1);

        super.update(subject, triples);
    }
    async store(subject, triples) {
        triples.push(new Triple(subject, Predicates.hasInstructor, new Node(this._hasInstructor)));
        return await super.store(subject, triples);
    }
    _fill(data) {
        this._hasInstructor = data[Constants.ontologyURI + "hasInstructor"];
        this._old._hasInstructor = data[Constants.ontologyURI + "hasInstructor"];
        super._fill(data);
    }
}
