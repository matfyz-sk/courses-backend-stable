import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import Session from "./Session";

export default class Lab extends Session {
    constructor(uri) {
        super();
        this._uri = uri;
        this._type = "courses:Lab";
        this._subclassOf = "courses:Session";
        this._prefix = "http://www.courses.matfyz.sk/data/lab/";
        this.client = this.getClientInstance();
        this._old = {};
    }
    set room(value) {
        if (this._room) {
            this._old._room = this._room;
        }
        this._room = value;
    }
    delete() {
        const subject = new Node(this._uri);
        var triples = [
            new Triple(subject, Predicates.type, this._type, Triple.REMOVE),
            new Triple(subject, Predicates.subclassOf, this._subclassOf, Triple.REMOVE),
            new Triple(subject, Predicates.room, new Text(this._old._room), Triple.REMOVE)
        ];

        super.delete(subject, triples);
    }
    update() {
        const subject = new Node(this._uri);
        var t1 = new Triple(subject, Predicates.room, new Text(this._old._room));
        t1.updateObject(new Text(this._room));
        var triples = [t1];

        super.update(subject, triples);
    }
    async store() {
        // testing
        const subject = new Node(this._uri);
        var triples = [
            new Triple(subject, Predicates.type, this._type),
            new Triple(subject, Predicates.subclassOf, this._subclassOf),
            new Triple(subject, Predicates.room, new Text(this._room))
        ];
        const data = await super.store(subject, triples);
    }
    async fetch() {
        const data = await this.client.query(`SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this._uri}>}`, true);
        var actualData = {};
        for (var row of data.results.bindings) {
            const predicate = row.p.value;
            const object = row.o.value;
            if (!actualData.predicate) {
                actualData[predicate] = object;
            } else if (!Array.isArray(actualData.predicate)) {
                actualData.predicate = [actualData.predicate, object];
            } else {
                actualData.predicate.push(object);
            }
        }
        this._fill(actualData);
    }
    _fill(data) {
        this._room = data[Constants.ontologyURI + "room"];
        this._old._room = data[Constants.ontologyURI + "room"];
        super._fill(data);
    }
}
