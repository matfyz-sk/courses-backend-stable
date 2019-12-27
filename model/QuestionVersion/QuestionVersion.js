import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "../Thing";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class QuestionVersion extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.QuestionVersion;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.questionVersionURI;
    }

    set current(value) {
        this._setProperty(Predicates.current, new Data(value, "xsd:boolean"));
    }

    set approved(value) {
        this._setProperty(Predicates.approved, new Data(value, "xsd:boolean"));
    }

    set text(value) {
        this._setProperty(Predicates.text, new Text(value));
    }

    set version(value) {}

    set approvalTime(value) {}

    set next(value) {
        this._setProperty(Predicates.next, new Node(value));
    }

    set previous(value) {
        this._setProperty(Predicates.previous, new Node(value));
    }

    set hasComment(value) {
        this._setArrayProperty(Predicates.hasComment, value, Node);
    }

    set ofQuestion(value) {
        this._setProperty(Predicates.ofQuestion, new Node(value));
    }

    set approver(value) {
        this._setProperty(Predicates.approver, new Node(value));
    }

    set author(value) {
        this._setProperty(Predicates.author, new Node(value));
    }

    _fill(data) {
        super._fill(data);
    }
}
