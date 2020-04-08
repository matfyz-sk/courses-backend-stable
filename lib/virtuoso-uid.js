/*
    copied from https://github.com/crs4/virtuoso-uid/blob/master/index.js
    edited because of minor bugs
*/

import moment from "moment-timezone";

import { Node, Data, Triple, Client } from "virtuoso-sparql-client";

let SaveClient = null;
let config = null;

let defaults = {
   endpoint: null,
   graph: null,
   prefix: null,
   alphabet: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
   idLength: 5,
};

export const cfg = (options) => {
   config = Object.assign({}, defaults, options);
   if (config.idLength < 1) config.idLength = 1;
   if (!config.prefix) throw new Error("virtuoso-uid -> prefix can not be null");

   SaveClient = new Client(config.endpoint);
   SaveClient.setDefaultGraph(config.graph);
   SaveClient.addPrefixes({
      dcterms: "http://purl.org/dc/terms/",
   });
   SaveClient.setDefaultFormat("application/json");
};

export const create = (echo = false) => {
   if (!config) throw new Error("virtuoso-uid -> Call 'config' before...");

   return new Promise((resolve, reject) => {
      let iri = config.prefix + generate();
      verify(iri, echo)
         .then((result) => {
            if (Boolean(result.boolean)) {
               // Already present, do again...
               exports.create(echo);
            } else {
               return insert(iri, echo);
            }
         })
         .then(() => {
            return resolve(iri);
         })
         .catch((error) => {
            reject({
               source: "virtuoso-uid",
               method: "create",
               error: error,
            });
         });
   });
};

let verify = (iri, echo = false) => {
   let query = `ASK FROM <${config.graph}> {
        {<${iri}> ?a ?b}
        UNION
        {?e <${iri}> ?f}
        UNION
        {?c ?d <${iri}>}
      }`;

   return SaveClient.query(query, echo);
};

let insert = (iri, echo = false) => {
   let triple = new Triple(
      new Node(iri),
      "dcterms:created",
      new Data(moment().tz("Europe/Bratislava").toISOString(), "xsd:dateTimeStamp")
   );
   SaveClient.getLocalStore().add(triple);
   return SaveClient.store(echo);
};

let generate = () => {
   let rtn = "";
   for (let i = 0; i < config.idLength; i++) {
      rtn += config.alphabet.charAt(Math.floor(Math.random() * config.alphabet.length));
   }
   return rtn;
};
