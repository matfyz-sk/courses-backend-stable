import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import UserAnswer from "./UserAnswer";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class DirectAnswer extends UserAnswer {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.directAnswerURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.DirectAnswer;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.directAnswerURI;
        this.predicates.push({ predicate: Predicates.text, asNode: false, required: true, multiple: false });
    }

    set text(value) {
        this._setProperty(Predicates.text, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.text, new Text(data.text));
        super._fill(data);
    }
}
