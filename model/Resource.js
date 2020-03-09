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
        this.props[Predicates.type.value] = { required: false, multiple: false, type: Node };
    }

    getResourceCreatePolicy() {
        if (this.resource.hasOwnProperty("createPolicy")) {
            // console.log("hasownproperty");
            return this.resource.createPolicy;
        }
        var r = this.resource.subclassOf;
        // console.log("r", r);
        while (r) {
            if (r.hasOwnProperty("createPolicy")) {
                return r.createPolicy;
            }
            r = r.subclassOf;
        }
        return [];
    }

    isAbleToCreate(accessToken) {
        console.log("resource:", this.resource);
        const policies = this.getResourceCreatePolicy();
        console.log(policies);
        var promises = [];
        db.setQueryFormat("application/json");
        db.setQueryGraph("http://www.courses.matfyz.sk/data");

        var result = true;

        policies.forEach(async policy => {
            const policyParts = policy.split(".");

            var subject = policyParts[0];
            var propertyPath = policyParts[1];
            var object = policyParts[2];

            if (subject.startsWith("{") && subject.endsWith("}")) {
                // udaj z tokena
                subject = accessToken[subject.substring(1, subject.length - 1)];
            } else {
                // udaj ktory poslal pouzivatel z props
                subject = this.props[subject].value.obj.iri;
            }

            if (object.startsWith("{") && object.endsWith("}")) {
                // udaj z tokena
                object = accessToken[object.substring(1, object.length - 1)];
            } else {
                // udaj ktory poslal pouzivatel z props
                object = this.props[object].value.obj.iri;
            }

            const query = `SELECT <${subject}> WHERE {<${subject}> ${propertyPath} <${object}>}`;

            promises.push(
                db
                    .query(query, true)
                    .then(data => {
                        console.log(data.results.bindings);
                        if (data.results.bindings.length == 0) {
                            result = false;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            );
        });

        Promise.all(promises).then(() => console.log("query completed, result: ", result));

        // console.log("result:", result);
    }

    setSubject(id) {
        this.subject = new Node(this.resource.type.uriPrefix + id);
        this.id = id;
    }

    setPredicate(predicateName, value) {
        if (value == undefined) {
            if (this.props[predicateName].required) {
                throw `Predicate name ${predicateName} is required, but not provided`;
            }
            return;
        }
        if (!this.props.hasOwnProperty(predicateName)) {
            throw `Predicate name ${predicateName} is not acceptable for resource ${this.resource.type.value}`;
        }
        if (!this.props[predicateName].multiple) {
            if (Array.isArray(value)) {
                if (value.length > 1) {
                    throw `Predicate name ${predicateName} accept only one value`;
                }
                this._setProperty(
                    Predicates[predicateName],
                    new this.props[predicateName].type(value[0], this.props[predicateName].dataType)
                );
            } else {
                this._setProperty(Predicates[predicateName], new this.props[predicateName].type(value, this.props[predicateName].dataType));
            }
        } else {
            this._setArrayProperty(Predicates[predicateName], value, this.props[predicateName].type);
        }
    }

    setPredicateToDelete(predicateName, value) {
        if (!this.props.hasOwnProperty(predicateName) || !this.props[predicateName].value) {
            return;
        }
        if (!this.props[predicateName].multiple) {
            // delete single predicate value
            this.props[predicateName].value.setOperation(Triple.REMOVE);
            return;
        }
        if (!value) {
            // delete all values of predicate
            for (var triple of this.props[predicateName].value) {
                triple.setOperation(Triple.REMOVE);
            }
            return;
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        for (var v of value) {
            for (var triple of this.props[predicateName].value) {
                if (
                    (triple.obj.hasOwnProperty("iri") && triple.obj.iri == v) ||
                    (triple.obj.hasOwnProperty("value") && triple.obj.value == v)
                ) {
                    triple.setOperation(Triple.REMOVE);
                }
            }
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
            if (predicateName != "type") {
                if (!this.props[predicateName].primitive) {
                    this.query["@graph"][predicateName] = { "@id": `?${predicateName}URI` };
                    if (filters.hasOwnProperty(predicateName)) {
                        this.query["$where"].push(`${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI`);
                        this.query["$filter"].push(
                            `?${predicateName}URI=<${this._buildURI(this.props[predicateName].resource, filters[predicateName])}>`
                        );
                    } else {
                        this.query["$where"].push(
                            `OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI}`
                        );
                    }
                } else {
                    this.query["@graph"][predicateName] = `?${predicateName}`;
                    this.query["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}}`);
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

    _buildURI(resourceName, id) {
        const uriPrefix = Resources[resourceName].type.uriPrefix;
        return uriPrefix + id;
    }

    _prepareTriplesToStore() {
        this.props[Predicates.type.value].value = new Triple(this.subject, this._build(Predicates.type), this._build(this.resource.type));
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
                    if (t.getOperation() == Triple.REMOVE)
                        // t.setOperation(Triple.REMOVE);
                        this.triples.toRemove.push(t);
                }
                return;
            }
            // val.setOperation(Triple.REMOVE);
            if (val.getOperation() == Triple.REMOVE) this.triples.toRemove.push(val);
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

        if (this.triples.toRemove.length > 0) {
            db.getLocalStore().empty();
            db.getLocalStore().bulk(this.triples.toRemove);
            await db.store(true);
        }

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
        if (this.triples.toRemove.length > 0) db.getLocalStore().bulk(this.triples.toRemove);
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
                    if (!Array.isArray(data[predicateName])) {
                        data[predicateName] = [data[predicateName]];
                    }
                    this._setNewArrayProperty(Predicates[predicateName], data[predicateName], this.props[predicateName].type);
                } else {
                    this._setNewProperty(Predicates[predicateName], new this.props[predicateName].type(data[predicateName]));
                }
            }
        });
    }
}
