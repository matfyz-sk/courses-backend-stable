import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { db } from "../config/client";

export default class Thing {
    constructor(uri) {
        this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
        this.props = {};
        this._uri = uri;
        this.subject = new Node(uri);
        this.type = "";
        this.subclassOf = "";
    }

    getClientInstance() {
        const client = new Client(Constants.virtuosoEndpoint);
        client.addPrefixes({
            courses: Constants.ontologyURI
        });
        client.setQueryFormat("application/json");
        client.setQueryGraph(Constants.graphURI);
        client.setDefaultGraph(Constants.graphURI);

        return client;
    }

    _prepareTriples() {
        for (var key in this.props) {
            const val = this.props[key];
            if (Array.isArray(val)) {
                for (var t of val) {
                    if (t.getOperation() == Triple.ADD) this.triples.toAdd.push(t);
                    else if (t.getOperation() == Triple.UPDATE) this.triples.toUpdate.push(t);
                    else if (t.getOperation() == Triple.REMOVE) this.triples.toRemove.push(t);
                }
            } else {
                if (val.getOperation() == Triple.ADD) this.triples.toAdd.push(val);
                else if (val.getOperation() == Triple.UPDATE) this.triples.toUpdate.push(val);
                else if (val.getOperation() == Triple.REMOVE) this.triples.toRemove.push(val);
            }
        }
    }

    _setProperty(propertyName, predicateName, value) {
        if (!this.props[propertyName]) {
            this.props[propertyName] = new Triple(this.subject, predicateName, value);
        } else {
            this.props[propertyName].setOperation(Triple.ADD);
            this.props[propertyName].updateObject(value);
        }
    }

    _setArrayProperty(propertyName, predicateName, value, objectType) {
        if (this.props[propertyName]) for (var t of this.props[propertyName]) t.setOperation(Triple.REMOVE);
        else this.props[propertyName] = [];
        for (var uri of value) this.props[propertyName].push(new Triple(this.subject, predicateName, new objectType(uri)));
    }

    async _storeTriples() {
        this._prepareTriples();

        console.log("to add:", this.triples.toAdd);
        console.log("to remove:", this.triples.toRemove);
        console.log("to update:", this.triples.toUpdate);

        if (this.triples.toAdd.length > 0) {
            db.getLocalStore().empty();
            db.getLocalStore().bulk(this.triples.toAdd);
            await db.store(true);
        }

        if (this.triples.toUpdate.length > 0) {
            db.getLocalStore().empty();
            db.getLocalStore().bulk(this.triples.toUpdate);
            await db.store(true);
        }

        if (this.triples.toRemove.length > 0) {
            db.getLocalStore().empty();
            db.getLocalStore().bulk(this.triples.toRemove);
            await db.store(true);
        }
    }

    store() {
        this.props.type = new Triple(this.subject, Predicates.type, this.type, Triple.ADD);
        this.props.subclassOf = new Triple(this.subject, Predicates.subclassOf, this.subclassOf, Triple.ADD);
        this._storeTriples();
    }

    delete() {
        this.props.type.setOperation(Triple.REMOVE);
        this.props.subclassOf.setOperation(Triple.REMOVE);
        this._storeTriples();
    }

    patch() {
        this._storeTriples();
    }

    put() {}

    async fetch() {
        const data = await db.query(`SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this._uri}>}`, true);
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
        this.props.type = new Triple(this.subject, Predicates.type, this.type, "nothing");
        this.props.subclassOf = new Triple(this.subject, Predicates.subclassOf, this.subclassOf, "nothing");
    }
}
