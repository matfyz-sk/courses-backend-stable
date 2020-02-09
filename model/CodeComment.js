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
        this.props[Predicates.creator.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.commentTime.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.commentText.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.commentedText.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.commentedTextFrom.value] = {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:integer",
            primitive: true
        };
        this.props[Predicates.commentedTextTo.value] = {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:integer",
            primitive: true
        };
        this.props[Predicates.filePath.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
