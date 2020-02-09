import * as Classes from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class QuestionComment extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.questionCommentURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.QuestionComment;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.commentText.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.hasAuthor.value] = { required: false, multiple: false, type: Node, primitive: false };
        this.props[Predicates.created.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
