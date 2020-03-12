import { Triple, Node, Text } from "virtuoso-sparql-client";
import * as Predicates from "../constants/predicates";
import { db } from "../config/client";
import { getNewNode, getAllProps, getTripleObjectType } from "../helpers";
import * as Resources from "./index";

export default class Resource {
    constructor(resource) {
        this.id = 0;
        this.resource = resource;
        this.props = getAllProps(resource, false);
        this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
        this.query = {};
        this.removeOld = true;
        this.subject = undefined;
        this.props[Predicates.type.value] = { required: false, multiple: false, type: Node };
        this.props[Predicates.createdBy.value] = {};
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

    async setInputPredicates(data) {
        for (var predicateName in this.props) {
            if (this.props.hasOwnProperty(predicateName)) {
                await this.setPredicate(predicateName, data[predicateName]);
            }
        }
    }

    async setPredicate(predicateName, value) {
        if (value == undefined) {
            if (this.props[predicateName].required) {
                throw `Attribute '${predicateName}' is required`;
            }
            return;
        }
        if (!this.props.hasOwnProperty(predicateName)) {
            throw `Attribute '${predicateName}' is not acceptable for resource ${this.resource.type.value}`;
        }
        if (!this.props[predicateName].multiple) {
            if (Array.isArray(value)) {
                if (value.length > 1) {
                    throw `Attribute '${predicateName}' accepts only one value`;
                }
                value = value[0];
            }
            await this._setProperty(Predicates[predicateName], value);
        } else {
            await this._setArrayProperty(Predicates[predicateName], value);
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

    async _prepareTriplesToStore(userURI) {
        this.subject = await getNewNode(this.resource.type.uriPrefix);

        this.props[Predicates.type.value].value = new Triple(this.subject, this._build(Predicates.type), this._build(this.resource.type));
        this.props[Predicates.createdBy.value].value = new Triple(this.subject, this._build(Predicates.createdBy), new Node(userURI));

        for (var predicateName in this.props) {
            if (this.props.hasOwnProperty(predicateName)) {
                const val = this.props[predicateName].value;
                if (!val) {
                    continue;
                }
                if (Array.isArray(val)) {
                    for (var t of val) {
                        if (t instanceof Triple) {
                            t.subj = this.subject;
                            this.triples.toAdd.push(t);
                        } else {
                            await t._prepareTriplesToStore(userURI);
                            this.triples.toAdd = this.triples.toAdd.concat(t.triples.toAdd);
                            this.triples.toAdd.push(new Triple(this.subject, this._build(Predicates[predicateName]), t.subject));
                        }
                    }
                    continue;
                }

                if (val instanceof Triple) {
                    val.subj = this.subject;
                    this.triples.toAdd.push(val);
                } else {
                    await val._prepareTriplesToStore(userURI);
                    this.triples.toAdd = this.triples.toAdd.concat(val.triples.toAdd);
                    this.triples.toAdd.push(new Triple(this.subject, this._build(Predicates[predicateName]), val.subject));
                }
            }
        }
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
                    if (t.getOperation() == Triple.REMOVE) this.triples.toRemove.push(t);
                }
                return;
            }
            if (val.getOperation() == Triple.REMOVE) this.triples.toRemove.push(val);
        });
    }

    _build(val) {
        return val.prefix.name + ":" + val.value;
    }

    _resourceExists(resourceURI, resourceClass) {
        db.setQueryFormat("application/json");
        db.setQueryGraph("http://www.courses.matfyz.sk/data");
        return db.query(
            `SELECT <${resourceURI}> WHERE {<${resourceURI}> rdf:type ?type . ?type rdfs:subClassOf* ${resourceClass.prefix.name}:${resourceClass.value}}`,
            true
        );
    }

    async _setProperty(predicate, objectValue) {
        // objectValue moze byt: STRING alebo OBJEKT

        const objectValueType = typeof objectValue;

        if (objectValueType == "string") {
            const object = getTripleObjectType(this.props[predicate.value].dataType, objectValue);

            if (this.props[predicate.value].dataType === "node") {
                const objectClass = Resources[this.props[predicate.value].objectClass].type;
                const data = await this._resourceExists(objectValue, objectClass);
                if (data.results.bindings.length == 0) {
                    throw `Resource with URI ${objectValue} does not exists`;
                }
            }
            if (!this.props[predicate.value].value) {
                this.props[predicate.value].value = new Triple(this.subject, this._build(predicate), object);
            } else {
                this.props[predicate.value].value.setOperation(Triple.ADD);
                this.props[predicate.value].value.updateObject(object);
            }
        } else {
            // objectValue je objekt
            const r = new Resource(Resources[objectValue.type]);
            delete objectValue["type"];
            r.setInputPredicates(objectValue);
            this.props[predicate.value].value = r;
        }
    }

    async _setArrayProperty(predicate, objectValue) {
        if (this.props[predicate.value].value && this.removeOld) {
            for (var triple of this.props[predicate.value].value) {
                triple.setOperation(Triple.REMOVE);
            }
        }
        if (!this.props[predicate.value].hasOwnProperty("value")) {
            this.props[predicate.value].value = [];
        }

        if (this.props[predicate.value].dataType === "node") {
            const objectClass = this.props[predicate.value].objectClass;
            for (var value of objectValue) {
                const data = await this._resourceExists(value, objectClass);
                if (data.results.bindings.length == 0) {
                    throw `Resource with URI ${objectValue} does not exists`;
                }
                const object = getTripleObjectType(this.props[predicate.value].dataType, value);
                this.props[predicate.value].value.push(new Triple(this.subject, this._build(predicate), object));
            }
        } else {
            for (var value of objectValue) {
                const object = getTripleObjectType(this.props[predicate.value].dataType, value);
                this.props[predicate.value].value.push(new Triple(this.subject, this._build(predicate), object));
            }
        }
    }

    _setNewProperty(predicate, objectValue) {
        const object = getTripleObjectType(this.props[predicate.value].dataType, objectValue);
        this.props[predicate.value].value = new Triple(this.subject, this._build(predicate), object, "nothing");
    }

    _setNewArrayProperty(predicate, objectValue) {
        this.props[predicate.value].value = [];
        if (!objectValue) return;
        for (var value of objectValue) {
            const object = getTripleObjectType(this.props[predicate.value].dataType, value);
            this.props[predicate.value].value.push(new Triple(this.subject, this._build(predicate), object, "nothing"));
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

    async store(userURI) {
        await this._prepareTriplesToStore(userURI);

        // console.log(this.triples.toAdd);

        // return new Promise(1);

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

    completeDelete() {
        db.setQueryFormat("application/json");
        db.setQueryGraph("http://www.courses.matfyz.sk/data");
        return db.query(`DELETE WHERE {<${this.resource.type.uriPrefix + this.id}> ?p ?o}`, true).then(() => {
            db.setQueryFormat("application/json");
            db.setQueryGraph("http://www.courses.matfyz.sk/data");
            return db.query(`DELETE WHERE {?s ?p <${this.resource.type.uriPrefix + this.id}>}`, true);
        });
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
                    this._setNewArrayProperty(Predicates[predicateName], data[predicateName]);
                } else {
                    this._setNewProperty(Predicates[predicateName], data[predicateName]);
                }
            }
        });
    }
}
