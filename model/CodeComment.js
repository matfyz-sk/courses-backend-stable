import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class CodeComment extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.codeCommentURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.CodeComment;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.codeCommentURI;
    }

    set creator(value) {
        this._setProperty(Predicates.creator, new Node(value));
    }

    set commentTime(value) {
        this._setProperty(Predicates.commentTime, new Text(value));
    }

    set commentText(value) {
        this._setProperty(Predicates.commentText, new Text(value));
    }

    set commentedText(value) {
        this._setProperty(Predicates.commentedText, new Text(value));
    }

    set occurance(value) {
        this._setProperty(Predicates.occurance, new Data(value, "xsd:integer"));
    }

    set filePath(value) {
        this._setProperty(Predicates.filePath, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.creator, new Node(value));
        this._setNewProperty(Predicates.commentTime, new Text(value));
        this._setNewProperty(Predicates.commentText, new Text(value));
        this._setNewProperty(Predicates.commentedText, new Text(value));
        this._setNewProperty(Predicates.occurance, new Data(value, "xsd:integer"));
        this._setNewProperty(Predicates.filePath, new Text(value));
        super._fill(data);
    }
}
