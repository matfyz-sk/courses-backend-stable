import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class CodeReview extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.codeReviewURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.CodeReview;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.codeReviewURI;
    }

    set hasCodeComment(value) {
        this._setArrayProperty(Predicates.hasCodeComment, value, Node);
    }

    _fill(data) {
        super._fill(data);
    }
}
