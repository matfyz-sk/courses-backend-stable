import * as Classes from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
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
        this.props[Predicates.hasGeneralComment.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.hasCodeComment.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
