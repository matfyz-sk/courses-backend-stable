import * as Classes from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class QuizTake extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.quizTakeURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.QuizTake;
        this.subclassOf = Classes.Thing;
        [Predicates.startDate.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.endDate.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.submitedDate.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.reviewedDate.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.hasAuthor.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
