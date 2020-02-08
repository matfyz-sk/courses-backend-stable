import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
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
        this.uriPrefix = Constants.quizTakePrototypeURI;
        this.predicates.push({ predicate: Predicates.orderedQuestion, asNode: true, required: true, multiple: true });
    }

    set orderedQuestion(value) {
        this._setProperty(Predicates.orderedQuestion, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.orderedQuestion, new Node(data.orderedQuestion));
        super._fill(data);
    }
}
