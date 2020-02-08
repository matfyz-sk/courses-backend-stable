import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Task from "./Task";

export default class QuestionAssignment extends Task {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.questionAssignmentURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.QuestionAssignment;
        this.subclassOf = Classes.Task;
        this.uriPrefix = Constants.questionAssignmentURI;
    }

    set creationPeriod(value) {
        this._setProperty(Predicates.creationPeriod, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.creationPeriod, new Node(data.creationPeriod));
        super._fill(data);
    }
}
