import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as ID from "../lib/virtuoso-uid";
import { db } from "../config/client";

export default class Thing {
    constructor() {
        this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
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

    async _storeTriples() {
        this._prepareTriples();

        console.log(this.triples);

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
        this._storeTriples();
    }

    delete() {
        this._storeTriples();
    }

    patch() {
        this._storeTriples();
    }

    put() {}

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

    _fill(data) {}
}
