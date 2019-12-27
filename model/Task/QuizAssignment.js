import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Task from "./Task";

export default class QuizAssignment extends Task {
    constructor(uri) {
        super(uri);
        this.type = Classes.QuizAssignment;
        this.subclassOf = Classes.Task;
        this.uriPrefix = Constants.quizAssignmentURI;
    }

    set takingEvent(value) {
        this._setProperty(Predicates.takingEvent, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.takingEvent, new Node(data.takingEvent));
        super._fill(data);
    }
}
