import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class PredefinedAnswer extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.predefinedAnswerURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.PredefinedAnswer;
        this.subclassOf = Classes.Thing;
        [Predicates.text.value] = { required: false, multiple: false, type: Text, primitive: true };
        [Predicates.position.value] = { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true };
        [Predicates.correct.value] = { required: false, multiple: false, type: Data, dataType: "xsd:integer", primitive: true };
    }
}
