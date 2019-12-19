import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { db } from "../config/client";
import { getNewNode } from "../helpers";

export default class Thing {
    constructor(uri) {
        this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
        this.props = {};
        this._uri = uri;
        this.subject = new Node(uri);
        this.type = "";
        this.subclassOf = "";
        this.uriPrefix = "";
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

    _prepareTriplesToStore() {
        this.props.type = new Triple(this.subject, Predicates.type, this.type);
        this.props.subclassOf = new Triple(this.subject, Predicates.subclassOf, this.subclassOf);
        for (var key in this.props) {
            const val = this.props[key];
            if (Array.isArray(val)) {
                for (var t of val) {
                    t.subj = this.subject;
                    this.triples.toAdd.push(t);
                }
                continue;
            }
            val.subj = this.subject;
            this.triples.toAdd.push(val);
        }
    }

    _prepareTriplesToUpdate() {
        for (var key in this.props) {
            const val = this.props[key];
            if (Array.isArray(val)) {
                for (var t of val) this._arrangeTriple(t);
                continue;
            }
            this._arrangeTriple(val);
        }
    }

    _arrangeTriple(triple) {
        if (triple.getOperation() == Triple.ADD) this.triples.toAdd.push(triple);
        else if (triple.getOperation() == Triple.UPDATE) this.triples.toUpdate.push(triple);
        else if (triple.getOperation() == Triple.REMOVE) this.triples.toRemove.push(triple);
    }

    _prepareTriplesToDelete() {
        for (var key in this.props) {
            const val = this.props[key];
            if (Array.isArray(val)) {
                for (var t of val) {
                    t.setOperation(Triple.REMOVE);
                    this.triples.toRemove.push(t);
                }
                continue;
            }
            val.setOperation(Triple.REMOVE);
            this.triples.toRemove.push(val);
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

    async store() {
        this.subject = await getNewNode(this.uriPrefix);
        this._prepareTriplesToStore();
        db.getLocalStore().empty();
        db.getLocalStore().bulk(this.triples.toAdd);
        return db.store(true);
    }

    delete() {
        this._prepareTriplesToDelete();
        db.getLocalStore().empty();
        db.getLocalStore().bulk(this.triples.toRemove);
        return db.store(true);
    }

    patch() {
        this._prepareTriplesToUpdate();
        this._storeTriples();
    }

    put() {}

    async fetch() {
        const data = await db.query(`SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this._uri}>}`, true);
        var actualData = {};
        for (var row of data.results.bindings) {
            const predicate = row.p.value;
            const object = row.o.value;
            if (actualData[predicate]) {
                if (Array.isArray(actualData[predicate])) {
                    actualData[predicate].push(object);
                } else {
                    actualData[predicate] = [actualData[predicate], object];
                }
                continue;
            }
            actualData[predicate] = object;
        }
        this._fill(actualData);
    }

    _fill(data) {
        this.props.type = new Triple(this.subject, Predicates.type, this.type, "nothing");
        this.props.subclassOf = new Triple(this.subject, Predicates.subclassOf, this.subclassOf, "nothing");
    }
}
