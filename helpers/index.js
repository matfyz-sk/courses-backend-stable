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

export async function resourceExists(resourceURI, expectedType) {
    resourceURI = "<" + resourceURI + ">";
    const q = new Query();

    q.setProto({
        id: resourceURI,
        type: predicate(type)
    });
    q.setWhere([`${resourceURI} ${type} ${expectedType}`]);
    const res = await q.run();

    if (JSON.stringify(res) == "{}") {
        return false;
    }
    if (Array.isArray(res) && res.length > 0) {
        return true;
    }
    return false;
}
