import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class GeneralComment extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.GeneralComment;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.generalCommentURI;
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

    _fill(data) {
        this._setNewProperty(Predicates.creator, new Node(value));
        this._setNewProperty(Predicates.commentTime, new Text(value));
        this._setNewProperty(Predicates.commentText, new Text(value));
        super._fill(data);
    }
}
