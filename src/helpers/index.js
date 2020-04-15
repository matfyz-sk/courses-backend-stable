import * as Constants from "../constants";
import { Client, Node, Data, Text } from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import * as Resources from "../model";
import moment from "moment-timezone";
import RequestError from "./RequestError";
import jwt from "jsonwebtoken";

export function getTripleObjectType(objectTypeName, objectValue) {
   switch (objectTypeName) {
      case "node":
         return new Node(objectValue);
      case "integer":
         return new Data(objectValue, "xsd:integer");
      case "float":
         return new Data(objectValue, "xsd:float");
      case "boolean":
         return new Data(objectValue, "xsd:boolean");
      case "dateTime":
         return new Data(objectValue, "xsd:dateTimeStamp");
      case "string":
         return new Text(objectValue);
      default:
         throw new RequestError(`Invalid object type '${objectTypeName}'`, 500);
   }
}

export function getResourceObject(resourceName) {
   resourceName = resourceName.charAt(0).toLowerCase() + resourceName.slice(1);
   if (!Resources[resourceName]) {
      throw new RequestError(`Resource with class name '${resourceName}' is not supported`, 400);
   }
   return Resources[resourceName];
}

export function getAllProps(resource, includeSubclasses = true) {
   var props = {};
   var r = resource;
   while (r) {
      Object.keys(r.props).forEach((key) => {
         props[key] = { ...r.props[key] };
      });
      r = r.subclassOf;
   }

   if (
      !resource.hasOwnProperty("subclasses") ||
      !Array.isArray(resource.subclasses) ||
      !includeSubclasses
   ) {
      return props;
   }

   var subclasses = [...resource.subclasses];
   while (subclasses.length > 0) {
      const className = subclasses.shift();
      r = Resources[className];
      if (r) {
         Object.keys(r.props).forEach((key) => {
            props[key] = { ...r.props[key] };
         });
         subclasses.concat(r.subclasses);
      }
   }

   return props;
}

export function client() {
   const client = new Client(Constants.virtuosoEndpoint);
   client.addPrefixes({
      courses: Constants.ontologyURI,
   });
   client.setQueryFormat("application/json");
   client.setQueryGraph(Constants.graphURI);
   client.setDefaultGraph(Constants.graphURI);
   return client;
}

export async function getNewNode(resourceURI) {
   ID.cfg({
      endpoint: Constants.virtuosoEndpoint,
      graph: Constants.graphURI,
      prefix: resourceURI,
   });
   let newNode;
   await ID.create()
      .then((commentIdTmp) => {
         newNode = new Node(commentIdTmp);
      })
      .catch(console.log);
   return newNode;
}

export function generateToken({ userURI, email }) {
   let token = jwt.sign({ userURI, email }, Constants.authSecret, {
      algorithm: "HS256",
   });
   return token;
}

export function classPrefix(className) {
   const lowerCaseClassName = className.charAt(0).toLowerCase() + className.slice(1);
   return Constants.graphURI + "/" + lowerCaseClassName + "/";
}

export function className(className, includePrefix = false) {
   const upperCaseClassName = className.charAt(0).toUpperCase() + className.slice(1);
   return includePrefix ? "courses:" + upperCaseClassName : upperCaseClassName;
}

export function uri2className(uri) {
   return className(uri.substring(Constants.ontologyURI.length));
}

export function uri2id(uri) {
   return uri.substring(uri.lastIndexOf("/") + 1);
}

export function isIsoDate(str) {
   if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
   var d = new Date(str);
   return d.toISOString() === str;
}

export function dateTime() {
   return moment().tz("Europe/Bratislava").format("DD-MM-YYYY HH:mm:ss");
}
