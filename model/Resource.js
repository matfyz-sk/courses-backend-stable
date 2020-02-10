import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import { thingURI } from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { db } from "../config/client";
import { getNewNode, getAllProps } from "../helpers";
import { body, param, validationResult } from "express-validator";
import { validateRequest } from "../helpers";
import * as Messages from "../constants/messages";
import Query from "../query/Query";

export default class Resource {
    constructor(resource) {
        this.id = 0;
        this.resource = resource;
        this.props = getAllProps(resource);
        this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
        this.query = {};
        this.removeOld = true;
        this.subject = undefined;
        [Predicates.type.value] = { required: false, multiple: false, type: Text };
        [Predicates.subclassOf.value] = { required: false, multiple: false, type: Text };
    }

    setSubject(id) {
        this.subject = new Node(this.resource.type.uriPrefix + id);
        this.id = id;
    }

    setPredicate(predicateName, value) {
        if (![predicateName]) {
            console.error(`Predicate ${predicateName} is not relevant for this resource`);
            return;
        }
        if (![predicateName].multiple) {
            this._setProperty(Predicates[predicateName], new [predicateName].type(value, [predicateName].dataType));
        } else {
            this._setArrayProperty(Predicates[predicateName], value, [predicateName].type);
        }
    }

    generateQuery(filters) {
        var resourceURI = "?resourceURI";
        if (filters.id) {
            resourceURI = `<${this.resource.type.uriPrefix + filters.id}>`;
        }
        this.query = {
            "@graph": {
                "@id": resourceURI,
                "@type": this.resource.type.value
            },
            $where: [`${resourceURI} ${this._build(Predicates.type)} ${this._build(this.resource.type)}`],
            $filter: []
        };

        if (filters._offset) this.query["$offset"] = filters._offset;
        if (filters._limit) this.query["$limit"] = filters._limit;

        Object.keys().forEach(predicateName => {
            if (predicateName != "type" && predicateName != "subclassOf") {
                if (![predicateName].primitive) {
                    this.query["@graph"][predicateName] = { "@id": `?${predicateName}URI` };
                    this.query["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI}`);
                    if (predicateName in filters) {
                        this.query["$filter"].push(`?${predicateName}URI=<${filters[predicateName]}>`);
                    }
                } else {
                    this.query["@graph"][predicateName] = `?${predicateName}`;
                    this.query["$where"].push(`${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}`);
                    if (predicateName in filters) {
                        this.query["$filter"].push(`?${predicateName}="${filters[predicateName]}"`);
                    }
                }
            }
        });
        const q = new Query();
        q.setProto(this.query["@graph"]);
        q.setWhere(this.query["$where"]);
        q.setOffset(this.query["$offset"]);
        q.setLimit(this.query["$limit"]);
        q.setFilter(this.query["$filter"]);
        return q;
    }

    _prepareTriplesToStore() {
        this.props.type.value = new Triple(this.subject, this._build(Predicates.type), this._build(this.resource.type));
        this.props.subclassOf.value = new Triple(
            this.subject,
            this._build(Predicates.subclassOf),
            this._build(this.resource.subclassOf.type)
        );
        Object.keys().forEach(key => {
            const val = [key].value;
            if (!val) {
                return;
            }
            if (Array.isArray(val)) {
                for (var t of val) {
                    t.subj = this.subject;
                    this.triples.toAdd.push(t);
                }
                return;
            }
            val.subj = this.subject;
            this.triples.toAdd.push(val);
        });
    }

    _prepareTriplesToUpdate() {
        Object.keys().forEach(key => {
            const val = [key].value;
            if (!val) {
                return;
            }
            if (Array.isArray(val)) {
                for (var t of val) this._arrangeTriple(t);
                return;
            }
            this._arrangeTriple(val);
        });
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
        Object.keys().forEach(key => {
            const val = [key].value;
            if (!val) {
                return;
            }
            if (Array.isArray(val)) {
                for (var t of val) {
                    t.setOperation(Triple.REMOVE);
                    this.triples.toRemove.push(t);
                }
                return;
            }
            val.setOperation(Triple.REMOVE);
            this.triples.toRemove.push(val);
        });
    }

    _build(val) {
        return val.prefix.name + ":" + val.value;
    }

    _setProperty(predicate, object) {
        if (![predicate.value].value) {
            [predicate.value].value = new Triple(this.subject, this._build(predicate), object);
        } else {
            [predicate.value].value.setOperation(Triple.ADD);
            [predicate.value].value.updateObject(object);
        }
    }

    _setArrayProperty(predicate, objectValue, objectType) {
        if ([predicate.value].value && this.removeOld) {
            for (var triple of [predicate.value].value) {
                triple.setOperation(Triple.REMOVE);
            }
        }
        if (![predicate.value].value) {
            [predicate.value].value = [];
        }
        for (var value of objectValue) {
            [predicate.value].value.push(new Triple(this.subject, this._build(predicate), new objectType(value)));
        }
    }

    _setNewProperty(predicate, object) {
        [predicate.value].value = new Triple(this.subject, this._build(predicate), object, "nothing");
    }

    _setNewArrayProperty(predicate, objectArrayValue, objectType) {
        [predicate.value].value = [];
        if (!objectArrayValue) return;
        for (var value of objectArrayValue) {
            [predicate.value].value.push(new Triple(this.subject, this._build(predicate), new objectType(value), "nothing"));
        }
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
        this.subject = await getNewNode(this.resource.type.uriPrefix);
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
        return db.query(`SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this.resource.type.uriPrefix + this.id}>}`, true);
    }

    _prepareData(data) {
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

    fill(data) {
        data = this._prepareData(data);
        Object.keys().forEach(predicateName => {
            if (data[predicateName]) {
                if ([predicateName].multiple) {
                    this._setNewArrayProperty(Predicates[predicateName], data[predicateName], [predicateName].type);
                } else {
                    this._setNewProperty(Predicates[predicateName], new [predicateName].type(data[predicateName]));
                }
            }
        });
    }
}
