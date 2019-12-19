import * as Classes from "../../constants/classes";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "../Thing";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import { getNewNode } from "../../helpers";
import Task from "./Task";

export default class QuestionAssignment extends Task {
    constructor(uri) {
        super();
        this._uri = uri;
        this._type = Classes.QuestionAssignment;
        this._subclassOf = Classes.Task;
        this.client = this.getClientInstance();
        this._old = {};
    }

    async store() {
        var subject = await getNewNode(Constants.questionAssignmentURI);
        var triples = [new Triple(subject, Predicates.type, this._type), new Triple(subject, Predicates.subclassOf, this._subclassOf)];
        super.store(subject, triples);
    }

    update() {}
    delete() {}
}
