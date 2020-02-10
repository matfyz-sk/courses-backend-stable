import * as Classes from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class GeneralComment extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.generalCommentURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.GeneralComment;
        this.subclassOf = Classes.Thing;
        [Predicates.creator.value] = { required: false, multiple: false, type: Node, primitive: false };
        [Predicates.commentTime.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.commentText.value] = { required: false, multiple: false, type: Text, primitive: true };
    }
}
