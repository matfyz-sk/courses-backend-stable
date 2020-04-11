import { Triple, Node } from "virtuoso-sparql-client";
import {
   getNewNode,
   getAllProps,
   getTripleObjectType,
   classPrefix,
   className,
   client,
} from "../helpers";
import * as Resources from "../model";
import * as Constants from "../constants";
import RequestError from "../helpers/RequestError";

export default class Resource {
   constructor(cfg) {
      this.resource = cfg.resource;
      this.user = cfg.user;
      this.id = cfg.id;
      this._setSubject();
      this.triples = { toAdd: [], toUpdate: [], toRemove: [] };
      this.db = client();
      this.removeOld = true;
      this.props = getAllProps(cfg.resource, false);
      this.props.type = {};
      this.props.createdBy = {};
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

   _setSubject() {
      if (this.id != undefined) {
         this.subject = new Node(classPrefix(this.resource.type) + this.id);
      } else {
         this.subject = undefined;
      }
   }

   async setInputPredicates(data) {
      for (let predicateName of Object.keys(this.props)) {
         if (predicateName != "type" || predicateName != "createdBy") {
            await this.setPredicate(predicateName, data[predicateName]);
         }
      }
   }

   async setPredicate(predicateName, value) {
      if (value == undefined) {
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
         await this._setArrayProperty(predicateName, value);
      }
   }

   async setPredicateToDelete(predicateName, value) {
      if (!this.props.hasOwnProperty(predicateName) || !this.props[predicateName].value) {
         return;
      }
      // autorizacia uprav
      // const changeRules = this.props[predicateName].change;
      // for (var rule of changeRules) {
      //    const res = await this._resolveAuthRule(rule);
      //    if (!res) {
      //       throw new RequestError(`You can't change value of attribute '${predicateName}'`, 403);
      //    }
      // }
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

   async _prepareProperties() {
      if (this.subject == undefined) {
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
      }

      for (let predicateName of Object.keys(this.props)) {
         const value = this.props[predicateName].value;
         if (!value) {
            if (this.props[predicateName].required) {
               throw new RequestError(`Attribute '${predicateName}' is required`, 422);
            }
            continue;
         }
         if (Array.isArray(value)) {
            for (let val of value) {
               await this._arrangeTriple(predicateName, val);
            }
            continue;
         }
         await this._arrangeTriple(predicateName, value);
      }
   }

   async _arrangeTriple(predicateName, triple) {
      if (triple instanceof Resource) {
         await triple._prepareProperties();
         this.triples.toAdd = this.triples.toAdd.concat(triple.triples.toAdd);
         this.triples.toAdd.push(
            new Triple(this.subject, `courses:${predicateName}`, triple.subject)
         );
         return;
      }

      if (triple.getOperation() == Triple.ADD) {
         triple.subj = this.subject;
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

   async _resourceExists(resourceURI, resourceClass) {
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      const data = await this.db.query(
         `SELECT <${resourceURI}> WHERE {<${resourceURI}> rdf:type ?type . ?type rdfs:subClassOf* ${className(
            resourceClass,
            true
         )}}`,
         true
      );
      return data.results.bindings.length > 0;
   }

   async _setProperty(predicateName, objectValue) {
      const valConstruct = objectValue.constructor.name;

      if (valConstruct == "Object") {
         const r = new Resource({ resource: getResourceObject(objectValue.type), user: this.user });
         // await r.isAbleToCreate();
         r.setInputPredicates(objectValue);
         this.props[predicateName].value = r;
         return;
      }

      const object = getTripleObjectType(this.props[predicateName].dataType, objectValue);

      if (
         this.props[predicateName].dataType === "node" &&
         !(await this._resourceExists(objectValue, this.props[predicateName].objectClass))
      ) {
         throw new RequestError(`Resource with URI ${objectValue} doesn't exist`, 400);
      }

      if (!this.props[predicateName].value) {
         this.props[predicateName].value = new Triple(
            this.subject,
            `courses:${predicateName}`,
            object
         );
      } else {
         // autorizacia uprav
         // const changeRules = this.props[predicateName].change;
         // if (Array.isArray(changeRules)) {
         //    for (var rule of changeRules) {
         //       const res = await this._resolveAuthRule(rule);
         //       if (!res) {
         //          throw new RequestError(
         //             `You can't change value of attribute '${predicateName}'`,
         //             403
         //          );
         //       }
         //    }
         // }
         this.props[predicateName].value.setOperation(Triple.ADD);
         this.props[predicateName].value.updateObject(object);
      }
   }

   async _setArrayProperty(predicateName, objectValue) {
      if (this.props[predicateName].value && this.removeOld) {
         for (var triple of this.props[predicateName].value) {
            triple.setOperation(Triple.REMOVE);
         }
      }
      if (!this.props[predicateName].hasOwnProperty("value")) {
         this.props[predicateName].value = [];
      }

      if (this.props[predicateName].dataType != "node") {
         for (let value of objectValue) {
            const object = getTripleObjectType(this.props[predicateName].dataType, value);
            this.props[predicateName].value.push(
               new Triple(this.subject, `courses:${predicateName}`, object)
            );
         }
         return;
      }

      for (let value of objectValue) {
         if (value.constructor.name == "Number" || value.constructor.name == "Boolean") {
            throw new RequestError(`Invalid value for attribute '${predicateName}'`, 400);
         }

         if (value.constructor.name == "Object") {
            const r = new Resource({ resource: getResourceObject(value.type), user: this.user });
            // await r.isAbleToCreate();
            r.setInputPredicates(value);
            this.props[predicateName].value.push(r);
         } else {
            if (!(await this._resourceExists(value, this.props[predicateName].objectClass))) {
               throw new RequestError(`Resource with URI ${value} doesn't exist`, 400);
            }
            const object = getTripleObjectType(this.props[predicateName].dataType, value);
            this.props[predicateName].value.push(
               new Triple(this.subject, `courses:${predicateName}`, object)
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
      for (let value of objectValue) {
         const object = getTripleObjectType(this.props[predicate].dataType, value);
         this.props[predicate].value.push(
            new Triple(this.subject, `courses:${predicate}`, object, "nothing")
         );
      }
   }

   async store(post = true) {
      await this._prepareProperties(post);

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

   async completeDelete() {
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      await this.db.query(`DELETE WHERE {<${this.subject.iri}> ?p ?o}`, true);
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      await this.db.query(`DELETE WHERE {?s ?p <${this.subject.iri}>}`, true);
   }

   async fetch() {
      this.db.setQueryFormat("application/json");
      this.db.setQueryGraph(Constants.graphURI);
      const data = await this.db.query(
         `SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this.subject.iri}>}`,
         true
      );
      if (data.results.bindings.length == 0) {
         throw new RequestError(`Resource with URI ${this.subject.iri} doesn't exist`, 404);
      }
      this._fill(data.results.bindings);
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

   _fill(data) {
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
