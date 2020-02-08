import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class Comment extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.commentURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Comment;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.commentURI;
    }

    set text(value) {
        this._setProperty(Predicates.text, new Text(value));
    }

    set author(value) {
        this._setProperty(Predicates.author, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.text, new Text(data.text));
        this._setNewProperty(Predicates.author, new Node(data.author));
        super._fill(data);
    }
}
