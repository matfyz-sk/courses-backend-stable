import * as Constants from "../constants";
import * as Classes from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
import * as ID from "../lib/virtuoso-uid";
import Query from "../query/Query";
import { type } from "../constants/predicates";
import { body, param, validationResult } from "express-validator";
import * as Resources from "../model";

export function getResourceObject(resourceName, resourceID = "") {
    if (!Resources[resourceName]) return undefined;
    return Resources[resourceName];
}

export function prepareClassName(className) {
    return className.charAt(0).toLowerCase() + className.slice(1);
}

export function getAllProps(resource) {
    var props = {};
    var r = resource;
    while (r) {
        Object.keys(r.props).forEach(key => {
            props[key] = r.props[key];
        });
        r = r.subclassOf;
    }

    if (!resource.hasOwnProperty("subclasses") || !Array.isArray(resource.subclasses)) {
        return props;
    }

    var subclasses = resource.subclasses;
    while (subclasses.length > 0) {
        const className = subclasses.shift();
        r = Resources[className];
        if (r) {
            Object.keys(r.props).forEach(key => {
                props[key] = r.props[key];
            });
            subclasses.concat(r.subclasses);
        }
    }

    return props;
}

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

export function predicate(predicate, required = true) {
    return "$" + predicate + (required ? "$required" : "");
}

export function prepareQueryUri(uri, type) {
    uri = uri.trim();
    if (!uri.startsWith("http:") && !uri.startsWith("<http:")) {
        return "<" + classToURI(type) + uri + ">";
    }
    if (uri.charAt(0) != "<") uri = "<" + uri;
    if (uri.charAt(uri.length - 1) != ">") uri = uri + ">";
    return uri;
}

export function resourceExists(resourceURI, expectedType) {
    return findByURI(resourceURI, expectedType).then(data => {
        if (emptyResult(data)) {
            return Promise.reject(`Resource with URI ${resourceURI} and type ${expectedType} does not exists`);
        }
    });
}

export function findByURI(resourceURI, expectedType) {
    const uri = prepareQueryUri(resourceURI, expectedType);
    const p = type.prefix.name + ":" + type.value;
    const q = new Query();
    q.setProto({ id: uri, type: predicate(p) });
    q.setWhere([`${uri} ${p} ${expectedType}`]);
    return q.run();
}

export function emptyResult(data) {
    const stringified = JSON.stringify(data);
    return stringified == undefined || stringified == "{}" || stringified == "[]";
}

function classToURI(className) {
    switch (className) {
        case Classes.Course:
            return Constants.coursesURI;
        case Classes.CourseInstance:
            return Constants.courseInstancesURI;
        case Classes.Event:
            return Constants.eventsURI;
        case Classes.Lab:
            return Constants.labURI;
        case Classes.Lecture:
            return Constants.lectureURI;
        case Classes.Session:
            return Constants.sessionURI;
        case Classes.Team:
            return Constants.teamsURI;
        case Classes.Topic:
            return Constants.topicURI;
        case Classes.User:
            return Constants.usersURI;
        default:
            return "";
    }
}

export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else next();
}
