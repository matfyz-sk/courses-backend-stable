import * as Constants from "../constants";
import { Node, Data, Text } from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import * as Resources from "../model";

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
   if (!Resources[resourceName]) return undefined;
   return Resources[resourceName];
}

export function prepareClassName(className) {
   return className.charAt(0).toLowerCase() + className.slice(1);
}

export function getAllProps(resource, includeSubclasses = true) {
   var props = {};
   var r = resource;
   while (r) {
      Object.keys(r.props).forEach(key => {
         props[key] = { ...r.props[key] };
      });
      r = r.subclassOf;
   }

   if (!resource.hasOwnProperty("subclasses") || !Array.isArray(resource.subclasses) || !includeSubclasses) {
      return props;
   }

   var subclasses = [...resource.subclasses];
   while (subclasses.length > 0) {
      const className = subclasses.shift();
      r = Resources[className];
      if (r) {
         Object.keys(r.props).forEach(key => {
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
      prefix: resourceURI
   });
   let newNode;
   await ID.create()
      .then(commentIdTmp => {
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
