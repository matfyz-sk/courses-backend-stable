import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class QuizTake extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.QuizTake;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.quizTakeURI;
    }

    set startDate(value) {
        this._setProperty(Predicates.startDate, new Text(value));
    }

    set endDate(value) {
        this._setProperty(Predicates.endDate, new Text(value));
    }

    set submitedDate(value) {
        this._setProperty(Predicates.submitedDate, new Text(value));
    }

    set reviewedDate(value) {
        this._setProperty(Predicates.reviewedDate, new Text(value));
    }

    set hasAuthor(value) {
        this._setProperty(Predicates.hasAuthor, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.startDate, new Text(data.startDate));
        this._setNewProperty(Predicates.endDate, new Text(data.endDate));
        this._setNewProperty(Predicates.submitedDate, new Text(data.submitedDate));
        this._setNewProperty(Predicates.reviewedDate, new Text(data.reviewedDate));
        this._setNewProperty(Predicates.hasAuthor, new Node(data.hasAuthor));
        super._fill(data);
    }
}
