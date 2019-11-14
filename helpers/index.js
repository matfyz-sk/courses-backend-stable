import { graphURI, virtuosoEndpoint } from "../constants";
import { Node } from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import Query from "../query/Query";
import { type } from "../constants/predicates";

/**
 * @param {String} resourceURI The full resource URI
 * @param {String} resourceId The resource ID
 * @param {Boolean} full
 */
export function buildUri(resourceURI, resourceId, full = true) {
    if (resourceURI.substr(resourceURI.length - 1) == "/") resourceURI = resourceURI.slice(0, -1);
    return `${full ? "<" : ""}${resourceURI}/${resourceId}${full ? ">" : ""}`;
}

export async function getNewNode(resourceURI) {
    ID.cfg({
        endpoint: virtuosoEndpoint,
        graph: graphURI,
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

export function predicate(predicate, required = true) {
    return "$" + predicate + (required ? "$required" : "");
}

export function prepareQueryUri(uri) {
    uri = uri.trim();
    if (uri.charAt(0) != "<") uri = "<" + uri;
    if (uri.charAt(uri.length - 1) != ">") uri = uri + ">";
    return uri;
}

export function resourceExists(resourceURI, expectedType) {
    return findByURI(resourceURI, expectedType).then(data => {
        if (JSON.stringify(data) == "[]") {
            return Promise.reject(`Resource with URI ${resourceURI} does not exists`);
        }
    });
}

export function findByURI(resourceURI, expectedType) {
    const uri = prepareQueryUri(resourceURI);
    const q = new Query();
    q.setProto({ id: uri, type: predicate(type) });
    q.setWhere([`${uri} ${type} ${expectedType}`]);
    return q.run();
}
