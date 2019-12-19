import * as Classes from "../constants/classes";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { getNewNode } from "../helpers";

export default class CourseInstance extends Event {
    constructor(uri) {
        super();
        this._uri = uri;
        this._type = Classes.CourseInstance;
        this._subclassOf = Classes.Event;
        this.client = this.getClientInstance();
        this._old = {};
    }

    set name(value) {}
    set description(value) {}
    set abbreviation(value) {}
    set hasPrerequisite(value) {}
    set mentions(value) {}
    set covers(value) {}

    async store() {
        var subject = await getNewNode(Constants.courseInstancesURI);
        var triples = [new Triple(subject, Predicates.type, this._type)];
        super.store(subject, triples);
    }

    update() {}
    delete() {}
}
