import { Client, Triple, Node } from "virtuoso-sparql-client";
import { getNewNode, getAllProps, getTripleObjectType, classPrefix, className } from "../helpers";
import * as Resources from "../model";
import * as Constants from "../constants";
import RequestError from "../helpers/RequestError";

export default class Resource {
   constructor(resource, user) {
      this.resource = resource;
      this.user = user;
      this.props = getAllProps(resource, false);
      this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
      this.db = new Client(Constants.virtuosoEndpoint);
      this._setupVirtuosoClient();
      this.removeOld = true;
      this.subject = undefined;
      this.props.type = {};
      this.props.createdBy = {};
   }

   _setupVirtuosoClient() {
      this.db.addPrefixes({
         courses: Constants.ontologyURI,
      });
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      this.db.setDefaultGraph(Constants.graphURI);
   }

   _getResourceCreateRules() {
      if (this.resource.hasOwnProperty("create")) {
         return this.resource.create;
      }
      var r = this.resource.subclassOf;
      while (r) {
         if (r.hasOwnProperty("create")) {
            return r.create;
         }
         r = r.subclassOf;
      }
      return [];
   }

   async isAbleToCreate() {
      const createRules = this._getResourceCreateRules();
      for (var rule of createRules) {
         const res = await this._resolveAuthRule(rule);
         if (!res) {
            throw new RequestError(`You can't create resource '${this.resource.type}'`, 401);
         }
      }
      return true;
   }

   setSubject(uri) {
      if (uri.startsWith("http://")) {
         this.subject = new Node(uri);
      } else {
         this.subject = new Node(classPrefix(this.resource.type) + uri);
      }
   }

   async setInputPredicates(data) {
      for (var predicateName in this.props) {
         if (this.props.hasOwnProperty(predicateName) && predicateName != "type") {
            await this.setPredicate(predicateName, data[predicateName]);
         }
      }
   }

   async setPredicate(predicateName, value) {
      if (value == undefined) {
         if (this.props[predicateName].required) {
            throw new RequestError(`Attribute '${predicateName}' is required`, 422);
         }
         return;
      }

      if (!this.props.hasOwnProperty(predicateName)) {
         throw new RequestError(
            `Attribute '${predicateName}' is not acceptable for resource '${this.resource.type}'`,
            422
         );
      }

      if (!this.props[predicateName].multiple) {
         if (Array.isArray(value)) {
            if (value.length > 1) {
               throw new RequestError(`Attribute '${predicateName}' accepts only one value`, 422);
            }
            value = value[0];
         }

         await this._setProperty(predicateName, value);
      } else {
         console.log("setting array property");
         await this._setArrayProperty(predicateName, value);
      }
   }

   async setPredicateToDelete(predicateName, value) {
      if (!this.props.hasOwnProperty(predicateName) || !this.props[predicateName].value) {
         return;
      }

      // autorizacia uprav
      const changeRules = this.props[predicateName].change;
      for (var rule of changeRules) {
         const res = await this._resolveAuthRule(rule);
         if (!res) {
            throw new RequestError(`You can't change value of attribute '${predicateName}'`, 403);
         }
      }

      if (!this.props[predicateName].multiple) {
         // delete single predicate value
         if (this.props[predicateName].required) {
            throw new RequestError(`You can't delete attribute '${predicateName}'`, 422);
         }
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

   async _prepareTriplesToStore() {
      this.subject = await getNewNode(classPrefix(this.resource.type));
      this.props.type.value = new Triple(
         this.subject,
         "rdf:type",
         className(this.resource.type, true)
      );
      this.props.createdBy.value = new Triple(
         this.subject,
         "courses:createdBy",
         new Node(this.user.userURI)
      );

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
                     await t._prepareTriplesToStore();
                     this.triples.toAdd = this.triples.toAdd.concat(t.triples.toAdd);
                     this.triples.toAdd.push(
                        new Triple(this.subject, `courses:${predicateName}`, t.subject)
                     );
                  }
               }
               continue;
            }

            if (val instanceof Triple) {
               val.subj = this.subject;
               this.triples.toAdd.push(val);
            } else {
               await val._prepareTriplesToStore();
               this.triples.toAdd = this.triples.toAdd.concat(val.triples.toAdd);
               this.triples.toAdd.push(
                  new Triple(this.subject, `courses:${predicateName}`, val.subject)
               );
            }
         }
      }
   }

   async _prepareTriplesToUpdate() {
      for (var key in this.props) {
         if (this.props.hasOwnProperty(key)) {
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
   }

   async _resolveAuthRule(rule) {
      if (rule == "admin") {
         return this.user.admin;
      }

      if (rule == "superAdmin") {
         return this.user.superAdmin;
      }

      var subject = null;
      var predicate = null;
      var object = null;
      if (rule == "owner") {
         subject = `<${this.user.userURI}>`;
         predicate = `courses:createdBy`;
         object = `<${this.subject.iri}>`;
      } else {
         const parts = rule.split(".");
         if (parts[0] == "[this]") {
            if (this.subject) {
               subject = `<${this.subject.iri}>`;
            }
         } else if (parts[0] == "{userURI}") {
            subject = `<${this.user.userURI}>`;
         }

         const regex = /([a-zA-Z]+)/gm;
         predicate = parts[1].replace(regex, "courses:$1");

         if (!subject) {
            subject = this.props[parts[1].split("/")[0]].value.iri;
         }

         if (parts[2][0] == "?") {
            object = parts[2];
         } else {
            object = `<${this.user.userURI}>`;
         }
      }
      this.db.setQueryGraph(Constants.graphURI);
      this.db.setQueryFormat("application/json");
      try {
         const data = await this.db.query(
            `SELECT ${subject} WHERE {${subject} ${predicate} ${object}}`,
            true
         );
         return data.results.bindings.length > 0;
      } catch (err) {
         return false;
      }
   }

   _arrangeTriple(triple) {
      if (triple.getOperation() == Triple.ADD) {
         // pri metode PUT, pridanie novej hodnoty k viachodnotovemu atributu
         this.triples.toAdd.push(triple);
         return;
      }
      if (triple.getOperation() == Triple.UPDATE) {
         // upravenie objektu trojice
         this.triples.toUpdate.push(triple);
         return;
      }
      if (triple.getOperation() == Triple.REMOVE) {
         // pri operacii PATCH, odstranenie vsetkych hodnot viachodnotoveho atributu
         this.triples.toRemove.push(triple);
         return;
      }
   }

   _prepareTriplesToDelete() {
      Object.keys(this.props).forEach((key) => {
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
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      return this.db.query(
         `SELECT <${resourceURI}> WHERE {<${resourceURI}> rdf:type ?type . ?type rdfs:subClassOf* ${className(
            resourceClass,
            true
         )}}`,
         true
      );
   }

   async _setProperty(predicateName, objectValue) {
      // objectValue moze byt: STRING alebo OBJEKT

      const objectValueType = typeof objectValue;

      if (
         objectValueType == "string" ||
         objectValueType == "number" ||
         objectValueType == "boolean"
      ) {
         const object = getTripleObjectType(this.props[predicateName].dataType, objectValue);

         if (this.props[predicateName].value) {
            // autorizacia uprav
            const changeRules = this.props[predicateName].change;
            if (Array.isArray(changeRules)) {
               for (var rule of changeRules) {
                  const res = await this._resolveAuthRule(rule);
                  if (!res) {
                     throw new RequestError(
                        `You can't change value of attribute '${predicateName}'`,
                        403
                     );
                  }
               }
            }
         }

         if (this.props[predicateName].dataType === "node") {
            // kontrola existencie
            const objectClass = this.props[predicateName].objectClass;
            const data = await this._resourceExists(objectValue, objectClass);
            if (data.results.bindings.length == 0) {
               throw new RequestError(`Resource with URI ${objectValue} doesn't exist`, 400);
            }
         }

         if (!this.props[predicateName].value) {
            this.props[predicateName].value = new Triple(
               this.subject,
               `courses:${predicateName}`,
               object
            );
         } else {
            this.props[predicateName].value.setOperation(Triple.ADD);
            this.props[predicateName].value.updateObject(object);
         }
      } else {
         // objectValue je objekt
         const r = new Resource(Resources[objectValue.type], this.user);
         await r.isAbleToCreate();
         delete objectValue["type"];
         r.setInputPredicates(objectValue);
         this.props[predicateName].value = r;
         console.log(this.props[predicateName].value);
      }
   }

   async _setArrayProperty(predicate, objectValue) {
      if (this.props[predicate].value && this.removeOld) {
         for (var triple of this.props[predicate].value) {
            triple.setOperation(Triple.REMOVE);
         }
      }
      if (!this.props[predicate].hasOwnProperty("value")) {
         this.props[predicate].value = [];
      }

      if (this.props[predicate].dataType === "node") {
         const objectClass = this.props[predicate].objectClass;
         for (var value of objectValue) {
            if (typeof value == "number" || typeof value == "boolean") {
               throw new RequestError(`Invalid value for attribute '${predicate}'`, 400);
            }

            if (typeof value == "string") {
               const data = await this._resourceExists(value, objectClass);
               if (data.results.bindings.length == 0) {
                  throw new RequestError(`Resource with URI ${value} doesn't exist`, 400);
               }
               const object = getTripleObjectType(this.props[predicate].dataType, value);
               this.props[predicate].value.push(
                  new Triple(this.subject, `courses:${predicate}`, object)
               );
            } else {
               // value je objekt
               const r = new Resource(Resources[value.type], this.user);
               await r.isAbleToCreate();
               delete value["type"];
               r.setInputPredicates(value);
               this.props[predicate].value = r;
            }
         }
      } else {
         for (var value of objectValue) {
            const object = getTripleObjectType(this.props[predicate].dataType, value);
            this.props[predicate].value.push(
               new Triple(this.subject, `courses:${predicate}`, object)
            );
         }
      }
   }

   _setNewProperty(predicate, objectValue) {
      const object = getTripleObjectType(this.props[predicate].dataType, objectValue);
      this.props[predicate].value = new Triple(
         this.subject,
         `courses:${predicate}`,
         object,
         "nothing"
      );
   }

   _setNewArrayProperty(predicate, objectValue) {
      this.props[predicate].value = [];
      if (!objectValue) return;
      for (var value of objectValue) {
         const object = getTripleObjectType(this.props[predicate].dataType, value);
         this.props[predicate].value.push(
            new Triple(this.subject, `courses:${predicate}`, object, "nothing")
         );
      }
   }

   async _storeTriples() {
      if (this.triples.toRemove.length > 0) {
         this.db.getLocalStore().empty();
         this.db.getLocalStore().bulk(this.triples.toRemove);
         await this.db.store(true);
      }

      if (this.triples.toAdd.length > 0) {
         this.db.getLocalStore().empty();
         this.db.getLocalStore().bulk(this.triples.toAdd);
         await this.db.store(true);
      }

      if (this.triples.toUpdate.length > 0) {
         this.db.getLocalStore().empty();
         this.db.getLocalStore().bulk(this.triples.toUpdate);
         await this.db.store(true);
      }
   }

   async store() {
      await this._prepareTriplesToStore();
      this.db.getLocalStore().empty();
      this.db.getLocalStore().bulk(this.triples.toAdd);
      return this.db.store(true);
   }

   delete() {
      this._prepareTriplesToDelete();
      this.db.getLocalStore().empty();
      if (this.triples.toRemove.length > 0) this.db.getLocalStore().bulk(this.triples.toRemove);
      return this.db.store(true);
   }

   completeDelete() {
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      return this.db.query(`DELETE WHERE {<${this.subject.iri}> ?p ?o}`, true).then(() => {
         this.db.setQueryFormat("application/json");
         this.db.setQueryGraph(Constants.graphURI);
         return this.db.query(`DELETE WHERE {?s ?p <${this.subject.iri}>}`, true);
      });
   }

   async update() {
      await this._prepareTriplesToUpdate();
      return this._storeTriples();
   }

   async fetch() {
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      const data = await this.db.query(
         `SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this.subject.iri}>}`,
         true
      );
      return data.results.bindings;
   }

   _prepareData(data) {
      var actualData = {};
      for (var row of data) {
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
      Object.keys(this.props).forEach((predicateName) => {
         if (
            predicateName == "type" ||
            predicateName == "createdBy" ||
            predicateName == "createdAt"
         ) {
            return;
         }
         if (data.hasOwnProperty(predicateName)) {
            if (this.props[predicateName].multiple) {
               if (!Array.isArray(data[predicateName])) {
                  data[predicateName] = [data[predicateName]];
               }
               this._setNewArrayProperty(predicateName, data[predicateName]);
            } else {
               this._setNewProperty(predicateName, data[predicateName]);
            }
         }
      });
   }
}
