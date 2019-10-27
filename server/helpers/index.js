import { graphURI, virtuosoEndpoint } from "../constants";
import { Node } from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import { Validator } from "jsonschema";

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

/**
 * @param {Object} requestBody
 * @param {Object} schema
 */
export function validateRequestBody(requestBody, schema) {
    var v = new Validator();
    var validationResult = v.validate(requestBody, schema);
    console.log(validationResult);
    if (validationResult.errors.length > 0) {
        var res = [];
        for (var validationError of validationResult.errors) {
            res.push(validationError.stack);
        }
        return res;
    }
    return [];
}
