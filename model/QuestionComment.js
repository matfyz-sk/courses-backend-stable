import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class QuestionComment extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.QuestionComment;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.questionCommentURI;
    }

    set commentText(value) {
        this._setProperty(Predicates.commentText, new Text(value));
    }

    set hasAuthor(value) {
        this._setProperty(Predicates.hasAuthor, new Node(value));
    }

    set created(value) {
        this._setProperty(Predicates.created, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.commentText, new Text(data.commentText));
        this._setNewProperty(Predicates.hasAuthor, new Node(data.hasAuthor));
        this._setNewProperty(Predicates.created, new Text(data.created));
        super._fill(data);
    }
}
