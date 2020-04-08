import * as Constants from "../constants";
import { Node, Data, Text } from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import * as Resources from "../model";
import moment from "moment-timezone";

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
         return null;
   }
}

export function getResourceObject(resourceName) {
   resourceName = resourceName.charAt(0).toLowerCase() + resourceName.slice(1);
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

export function classPrefix(className) {
   const lowerCaseClassName = className.charAt(0).toLowerCase() + className.slice(1);
   return Constants.graphURI + "/" + lowerCaseClassName + "/";
}

export function className(className, includePrefix = false) {
   const upperCaseClassName = className.charAt(0).toUpperCase() + className.slice(1);
   return includePrefix ? "courses:" + upperCaseClassName : upperCaseClassName;
}

export function isIsoDate(str) {
   if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
   var d = new Date(str);
   return d.toISOString() === str;
}

export function dateTime() {
   return moment().tz("Europe/Bratislava").format("DD-MM-YYYY HH:mm:ss");
}
