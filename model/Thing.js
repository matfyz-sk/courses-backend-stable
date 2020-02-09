import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import { thingURI } from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { db } from "../config/client";
import { getNewNode } from "../helpers";
import { body, param, validationResult } from "express-validator";
import { validateRequest } from "../helpers";
import * as Messages from "../constants/messages";
import Query from "../query/Query";

export default class Thing {
    constructor(id) {
        this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
        this.props = {};
        this.id = id;
        this.uriPrefix = thingURI;
        this.type = Classes.Thing;
        this.subclassOf = undefined;
        this.query = {};
        this.predicates = {};
        this.removeOld = true;
        this.subject = new Node(this.uriPrefix + this.id);
        this.props[Predicates.type.value] = { required: false, multiple: false, type: Text };
        this.props[Predicates.subclassOf.value] = { required: false, multiple: false, type: Text };
    }

    setPredicate(predicateName, value) {
        if (!this.props[predicateName]) {
            console.error("this predicate is not relevant for this resource");
            return;
        }
        if (!this.props[predicateName].multiple) {
            this._setProperty(Predicates[predicateName], new this.props[predicateName].type(value, this.props[predicateName].dataType));
        } else {
            this._setArrayProperty(Predicates[predicateName], value, this.props[predicateName].type);
        }
    }

    generateQuery(filters) {
        var resourceURI = "?resourceURI";
        if (filters.id) {
            resourceURI = `<${this.uriPrefix}${filters.id}>`;
        }
        this.query = {
            "@graph": {
                "@id": resourceURI,
                "@type": this.type.split(":")[1]
            },
            $where: [`${resourceURI} ${this._buildPredicate(Predicates.type)} ${this.type}`],
            $filter: []
        };

        if (filters._offset) this.query["$offset"] = filters._offset;
        if (filters._limit) this.query["$limit"] = filters._limit;

        for (var predicateName in this.props) {
            if (
                Object.prototype.hasOwnProperty.call(this.props, predicateName) &&
                predicateName != "type" &&
                predicateName != "subclassOf"
            ) {
                if (!this.props[predicateName].primitive) {
                    this.query["@graph"][predicateName] = { "@id": `?${predicateName}URI` };
                    this.query["$where"].push(
                        `OPTIONAL {${resourceURI} ${this._buildPredicate(Predicates[predicateName])} ?${predicateName}URI}`
                    );
                    if (predicateName in filters) {
                        this.query["$filter"].push(`?${predicateName}URI=<${filters[predicateName]}>`);
                    }
                } else {
                    this.query["@graph"][predicateName] = `?${predicateName}`;
                    this.query["$where"].push(`${resourceURI} ${this._buildPredicate(Predicates[predicateName])} ?${predicateName}`);
                    if (predicateName in filters) {
                        this.query["$filter"].push(`?${predicateName}="${filters[predicateName]}"`);
                    }
                }
            }
        }

        const q = new Query();
        q.setProto(this.query["@graph"]);
        q.setWhere(this.query["$where"]);
        q.setOffset(this.query["$offset"]);
        q.setLimit(this.query["$limit"]);
        q.setFilter(this.query["$filter"]);

        return q;
    }

    _prepareTriplesToStore() {
        this.props.type.value = new Triple(this.subject, this._buildPredicate(Predicates.type), this.type);
        this.props.subclassOf.value = new Triple(this.subject, this._buildPredicate(Predicates.subclassOf), this.subclassOf);
        for (var key in this.props) {
            const val = this.props[key].value;
            if (!val) {
                continue;
            }
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
            const val = this.props[key].value;
            if (!val) {
                continue;
            }
            if (Array.isArray(val)) {
                for (var t of val) this._arrangeTriple(t);
                continue;
            }
            this._arrangeTriple(val);
        }
    }

    _arrangeTriple(triple) {
        if (triple.getOperation() == Triple.ADD) {
            this.triples.toAdd.push(triple);
            return;
        }
        if (triple.getOperation() == Triple.UPDATE) {
            this.triples.toUpdate.push(triple);
            return;
        }
        if (triple.getOperation() == Triple.REMOVE) {
            this.triples.toRemove.push(triple);
            return;
        }
    }

    _prepareTriplesToDelete() {
        for (var key in this.props) {
            const val = this.props[key].value;
            if (!val) {
                continue;
            }
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

    _buildPredicate(predicate) {
        return predicate.prefix.name + ":" + predicate.value;
    }

    _setProperty(predicate, object) {
        if (!this.props[predicate.value].value) {
            this.props[predicate.value].value = new Triple(this.subject, this._buildPredicate(predicate), object);
        } else {
            this.props[predicate.value].value.setOperation(Triple.ADD);
            this.props[predicate.value].value.updateObject(object);
        }
    }

    _setNewProperty(predicate, object) {
        this.props[predicate.value].value = new Triple(this.subject, this._buildPredicate(predicate), object, "nothing");
    }

    _setArrayProperty(predicate, objectValue, objectType) {
        if (this.props[predicate.value].value && this.removeOld) {
            for (var triple of this.props[predicate.value].value) {
                triple.setOperation(Triple.REMOVE);
            }
        }
        if (!this.props[predicate.value].value) {
            this.props[predicate.value].value = [];
        }
        for (var value of objectValue) {
            this.props[predicate.value].value.push(new Triple(this.subject, this._buildPredicate(predicate), new objectType(value)));
        }
    }

    _setNewArrayProperty(predicate, objectArrayValue, objectType) {
        this.props[predicate.value].value = [];
        if (!objectArrayValue) return;
        for (var value of objectArrayValue) {
            this.props[predicate.value].value.push(
                new Triple(this.subject, this._buildPredicate(predicate), new objectType(value), "nothing")
            );
        }
    }

    _appendToArrayProperty(predicate, value) {
        if (!this.props[predicate.value].value || !Array.isArray(this.props[predicate.value].value)) return;
        this.props[predicate.value].value.push(new Triple(this.subject, this._buildPredicate(predicate), value));
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
        return this._storeTriples();
    }

    put() {
        this._prepareTriplesToUpdate();
        return this._storeTriples();
    }

    fetch() {
        db.setQueryFormat("application/json");
        db.setQueryGraph("http://www.courses.matfyz.sk/data");
        return db.query(`SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this.uriPrefix + this.id}>}`, true);
    }

    prepareData(data) {
        var actualData = {};
        for (var row of data.results.bindings) {
            var predicate = row.p.value;
            const object = row.o.value;
            const lastSharpIndex = predicate.lastIndexOf("#");
            const lastDashIndex = predicate.lastIndexOf("/");
            if (lastSharpIndex > lastDashIndex) {
                predicate = predicate.substring(lastSharpIndex + 1);
            } else {
                predicate = predicate.substring(lastDashIndex + 1);
            }
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
        return actualData;
    }

    _fill(data) {
        data = this.prepareData(data);
        // console.log("data", data);
        for (var predicateName in this.props) {
            if (Object.prototype.hasOwnProperty.call(this.props, predicateName) && data[predicateName]) {
                if (this.props[predicateName].multiple) {
                    this._setNewArrayProperty(Predicates[predicateName], data[predicateName], this.props[predicateName].type);
                } else {
                    this._setNewProperty(Predicates[predicateName], new this.props[predicateName].type(data[predicateName]));
                }
            }
        }
        // this._setNewProperty(Predicates.type, this.type);
        // this._setNewProperty(Predicates.subclassOf, this.subclassOf);
    }

    static validate() {
        return [validateRequest];
    }
}
