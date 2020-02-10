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
        [Predicates.commentText.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.hasAuthor.value] = { required: false, multiple: false, type: Node, primitive: false };
        [Predicates.created.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
