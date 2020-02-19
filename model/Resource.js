import { Triple, Node, Text } from "virtuoso-sparql-client";
import * as Predicates from "../constants/predicates";
import { db } from "../config/client";
import { getNewNode, getAllProps } from "../helpers";
import Query from "../query/Query";
import * as Resources from "./index";

export default class Resource {
    constructor(resource) {
        this.id = 0;
        this.resource = resource;
        this.props = getAllProps(resource);
        this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
        this.query = {};
        this.removeOld = true;
        this.subject = undefined;
        this.props[Predicates.type.value] = { required: false, multiple: false, type: Text };
        this.props[Predicates.subclassOf.value] = { required: false, multiple: false, type: Text };
    }

    setSubject(id) {
        this.subject = new Node(this.resource.type.uriPrefix + id);
        this.id = id;
    }

    setPredicate(predicateName, value) {
        if (!this.props[predicateName]) {
            console.error(`Predicate ${predicateName} is not relevant for this resource`);
            return;
        }
        if (!this.props[predicateName].multiple) {
            this._setProperty(Predicates[predicateName], new this.props[predicateName].type(value, this.props[predicateName].dataType));
        } else {
            this._setArrayProperty(Predicates[predicateName], value, this.props[predicateName].type);
        }
    }

    setPredicateToDelete(predicateName, value) {
        if (!this.props[predicateName].value) {
            return;
        }
        if (this.props[predicateName].multiple) {
            if (value) {
            }
        } else {
            this.props[predicateName].value.setOperation(Triple.REMOVE);
        }
    }

    generateQuery(filters) {
        var resourceURI = "?resourceURI";
        if (filters.id) {
            resourceURI = `<${this.resource.type.uriPrefix + filters.id}>`;
        }
        this.query = {
            "@graph": {
                "@id": resourceURI
            },
            $where: [],
            $filter: []
        };

        if (this.resource.hasOwnProperty("subclasses")) {
            this.query["@graph"]["@type"] = "?type";
            this.query["$where"].push(`${resourceURI} rdf:type ?type`);
            this.query["$where"].push(`?type rdfs:subClassOf* ${this._build(this.resource.type)}`);
        } else {
            this.query["@graph"]["@type"] = this.resource.type.value;
            this.query["$where"].push(`${resourceURI} ${this._build(Predicates.type)} ${this._build(this.resource.type)}`);
        }

        if (filters.hasOwnProperty("_offset")) this.query["$offset"] = filters._offset;
        if (filters.hasOwnProperty("_limit")) this.query["$limit"] = filters._limit;

        Object.keys(this.props).forEach(predicateName => {
            console.log(predicateName);
            if (predicateName != "type" && predicateName != "subClassOf") {
                if (!this.props[predicateName].primitive) {
                    this.query["@graph"][predicateName] = { "@id": `?${predicateName}URI` };
                    this.query["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI}`);
                    // if (this.props[predicateName].required) {
                    //     this.query["$where"].push(`${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI`);
                    // } else {
                    //     this.query["$where"].push(
                    //         `OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI}`
                    //     );
                    // }
                    if (filters.hasOwnProperty(predicateName)) {
                        this.query["$filter"].push(`?${predicateName}URI=<${filters[predicateName]}>`);
                    }
                } else {
                    this.query["@graph"][predicateName] = `?${predicateName}`;
                    this.query["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}}`);
                    // if (this.props[predicateName].required) {
                    //     this.query["$where"].push(`${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}`);
                    // } else {
                    //     this.query["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}}`);
                    // }
                    if (filters.hasOwnProperty(predicateName)) {
                        this.query["$filter"].push(`?${predicateName}="${filters[predicateName]}"`);
                    }
                }
            }
        });
        const q = new Query();
        q.setProto(this.query["@graph"]);
        q.setWhere(this.query["$where"]);
        if (this.query["$offset"]) q.setOffset(this.query["$offset"]);
        if (this.query["$limit"]) q.setLimit(this.query["$limit"]);
        q.setFilter(this.query["$filter"]);
        return q;
    }

    _prepareTriplesToStore() {
        this.props.type.value = new Triple(this.subject, this._build(Predicates.type), this._build(this.resource.type));
        if (this.resource.hasOwnProperty("subclassOf")) {
            this.props.subclassOf.value = new Triple(
                this.subject,
                this._build(Predicates.subclassOf),
                this._build(this.resource.subclassOf.type)
            );
        }
        Object.keys(this.props).forEach(key => {
            const val = this.props[key].value;
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
        Object.keys(this.props).forEach(key => {
            const val = this.props[key].value;
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
        Object.keys(this.props).forEach(key => {
            const val = this.props[key].value;
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
        if (!this.props[predicate.value].value) {
            this.props[predicate.value].value = new Triple(this.subject, this._build(predicate), object);
        } else {
            this.props[predicate.value].value.setOperation(Triple.ADD);
            this.props[predicate.value].value.updateObject(object);
        }
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
            this.props[predicate.value].value.push(new Triple(this.subject, this._build(predicate), new objectType(value)));
        }
    }

    _setNewProperty(predicate, object) {
        this.props[predicate.value].value = new Triple(this.subject, this._build(predicate), object, "nothing");
    }

    _setNewArrayProperty(predicate, objectArrayValue, objectType) {
        this.props[predicate.value].value = [];
        if (!objectArrayValue) return;
        for (var value of objectArrayValue) {
            this.props[predicate.value].value.push(new Triple(this.subject, this._build(predicate), new objectType(value), "nothing"));
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
        Object.keys(this.props).forEach(predicateName => {
            if (data.hasOwnProperty(predicateName)) {
                if (this.props[predicateName].multiple) {
                    this._setNewArrayProperty(Predicates[predicateName], data[predicateName], this.props[predicateName].type);
                } else {
                    this._setNewProperty(Predicates[predicateName], new this.props[predicateName].type(data[predicateName]));
                }
            }
        });
    }
}
