import * as Classes from "../constants/classes";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { getNewNode } from "../helpers";

export default class Task extends Thing {
    constructor(uri) {
        super();
        this._uri = uri;
        this._type = Classes.Task;
        this._subclassOf = Classes.Thing;
        this.client = this.getClientInstance();
        this._old = {};
    }

    async store() {
        var subject = await getNewNode(Constants.taskURI);
        var triples = [new Triple(subject, Predicates.type, this._type)];
        super.store(subject, triples);
    }

    update() {}
    delete() {}
}
