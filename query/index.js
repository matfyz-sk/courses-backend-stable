import lib from "sparql-transformer";
import { ontologyURI, virtuosoEndpoint, dcTermsURI } from "../constants";
import { getAllProps, classPrefix, className } from "../helpers";
import * as Resources from "../model";
import * as Constants from "../constants";

const sparqlOptions = {
   context: ontologyURI,
   endpoint: virtuosoEndpoint,
   debug: false,
};

const sparqlPrefixes = {
   courses: ontologyURI,
   dc: dcTermsURI,
};

function generateQuery(resource, filters, user) {
   var query = {
      "@graph": {},
      $where: [],
      $filter: [],
      $prefixes: sparqlPrefixes,
   };

   query["@graph"]["@id"] = resource.uri;

   if (filters.id) {
      resource.uri = `<${classPrefix(resource.obj.type) + filters.id}>`;
      query["@graph"]["@id"] = classPrefix(resource.obj.type) + filters.id;
   }

   if (resource.obj.hasOwnProperty("subclasses")) {
      query["@graph"]["@type"] = "?type";
      query.$where.push(`${resource.uri} rdf:type ?type`);
      query.$where.push(`?type rdfs:subClassOf* ${className(resource.obj.type, true)}`);
   } else {
      query["@graph"]["@type"] = Constants.ontologyURI + className(resource.obj.type);
      query.$where.push(`${resource.uri} rdf:type ${className(resource.obj.type, true)}`);
   }

   query["@graph"]["createdBy"] = "?createdBy";
   query["@graph"]["createdAt"] = "?createdAt";
   query.$where.push(`OPTIONAL {${resource.uri} courses:createdBy ?createdBy}`);
   query.$where.push(`OPTIONAL {${resource.uri} dc:created ?createdAt}`);

   setOffset(filters._offset);
   setLimit(filters._limit);

   const joins =
      filters.hasOwnProperty("_join") && typeof filters._join == "string"
         ? filters._join.split(",").map((e) => e.trim())
         : [];

   Object.keys(resource.props).forEach((predicateName) => {
      var objectVar = `?${predicateName}`;
      if (resource.props[predicateName].dataType === "node") {
         objectVar += "URI";
         query["@graph"][predicateName] = { "@id": objectVar };

         if (joins.includes(predicateName)) {
            generateQueryPart(resource, query, predicateName);
         }
         if (filters.hasOwnProperty(predicateName)) {
            query.$where.push(`${resource.uri} courses:${predicateName} ${objectVar}`);
            const objectClass = Resources[resource.props[predicateName].objectClass].type;
            query.$filter.push(
               `${objectVar}=<${classPrefix(objectClass) + filters[predicateName]}>`
            );
         } else {
            query.$where.push(`OPTIONAL {${resource.uri} courses:${predicateName} ${objectVar}}`);
         }
         return;
      }
      query["@graph"][predicateName] = objectVar;
      if (filters.hasOwnProperty(predicateName)) {
         query.$where.push(`${resource.uri} courses:${predicateName} ${objectVar}`);
         if (resource.props[predicateName].dataType == "string") {
            query.$filter.push(`${objectVar}="${filters[predicateName]}"`);
         } else {
            query.$filter.push(`${objectVar}=${filters[predicateName]}`);
         }
      } else {
         query.$where.push(`OPTIONAL {${resource.uri} courses:${predicateName} ${objectVar}}`);
      }
   });
   Object.keys(filters).forEach((predicateName) => {
      if (
         predicateName === "id" ||
         predicateName === "_offset" ||
         predicateName === "_limit" ||
         predicateName === "_join" ||
         resource.props.hasOwnProperty(predicateName)
      ) {
         return;
      }
      query.$where.push(`<${filters[predicateName]}> courses:${predicateName} ${resource.uri}`);
   });
   return query;
}

function generateQueryPart(resource, query, predicateName) {
   const queryPartResource = Resources[resource.props[predicateName].objectClass];
   const resourceProps = getAllProps(queryPartResource);
   const queryPart = query["@graph"][predicateName];
   const partURI = queryPart["@id"];

   queryPart["@type"] = partURI + "type";
   queryPart["createdBy"] = partURI + "createdBy";
   queryPart["createdAt"] = partURI + "createdAt";

   var where = `OPTIONAL { ${
      resource.uri
   } courses:${predicateName} ${partURI} . ${partURI} rdf:type ${partURI}type . ${partURI}type rdfs:subClassOf* ${className(
      queryPartResource.type,
      true
   )} . OPTIONAL {${partURI} courses:createdBy ${partURI}createdBy} . OPTIONAL {${partURI} dc:created ${partURI}createdAt} . `;

   Object.keys(resourceProps).forEach((p) => {
      // if (resourceProps[p].dataType === "node") {
      //     const objectVar = partURI + p + "URI";
      //     queryPart[p] = { "@id": objectVar };
      //     where += `OPTIONAL {${partURI} ${_build(Predicates[p])} ${objectVar}} . `;
      //     return;
      // }
      queryPart[p] = `${partURI + p}`;
      where += `OPTIONAL {${partURI} courses:${p} ${partURI + p}} . `;
   });

   where = where.substring(0, where.length - 2);
   where += "}";
   query.$where.push(where);
}

function setLimit(limit) {
   if (limit) query["$limit"] = limit;
}

function setOffset(offset) {
   if (offset) query["$offset"] = offset;
}

function setOrderBy(orderBy) {
   if (orderBy) query["$orderBy"] = orderBy;
}

function _nodesToArray(obj) {
   if (obj.constructor.name == "Array") {
      for (var val of obj) {
         _nodesToArray(val);
      }
      return;
   }
   for (var predicateName in obj) {
      if (obj.hasOwnProperty(predicateName)) {
         if (obj[predicateName].constructor.name != "Object") {
            continue;
         }
         if (Object.keys(obj[predicateName]).length == 0) {
            obj[predicateName] = [];
         } else {
            _nodesToArray(obj[predicateName]);
            obj[predicateName] = [obj[predicateName]];
         }
      }
   }
}

async function run(query) {
   const data = await lib.default(query, sparqlOptions);
   _nodesToArray(data["@graph"]);
   return data;
}

export default function runQuery(_resource, filters) {
   const resource = {
      obj: _resource,
      props: getAllProps(_resource),
      uri: "?resourceURI",
   };
   const query = generateQuery(resource, filters);
   return run(query);
}
