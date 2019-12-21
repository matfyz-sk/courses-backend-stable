import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Task from "./Task";

export default class Assignment extends Task {
    constructor(uri) {
        super();
        this.type = Classes.Assignment;
        this.subclassOf = Classes.Task;
        this.uriPrefix = Constants.assignmentURI;
    }

    set initialSubmissionPeriod(value) {
        this._setProperty(Predicates.initialSubmissionPeriod, new Node(value));
    }

    set peerReviewPeriod(value) {
        this._setProperty(Predicates.peerReviewPeriod, new Node(value));
    }

    set improvedSubmissionPeriod(value) {
        this._setProperty(Predicates.improvedSubmissionPeriod, new Node(value));
    }

    set teamReviewPeriod(value) {
        this._setProperty(Predicates.teamReviewPeriod, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.initialSubmissionPeriod, new Node(data.initialSubmissionPeriod));
        this._setNewProperty(Predicates.peerReviewPeriod, new Node(data.peerReviewPeriod));
        this._setNewProperty(Predicates.improvedSubmissionPeriod, new Node(data.improvedSubmissionPeriod));
        this._setNewProperty(Predicates.teamReviewPeriod, new Node(data.teamReviewPeriod));
        super._fill(data);
    }
}
