import * as Classes from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class QuizTakePrototype extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.quizTakePrototypeURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.QuizTakePrototype;
        this.subclassOf = Classes.Thing;
        [Predicates.orderedQuestion.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
