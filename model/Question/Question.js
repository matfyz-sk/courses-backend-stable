import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "../Thing";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class Question extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.Question;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.questionURI;
        this.predicates.push(
            { predicate: Predicates.name, asNode: false, required: true, multiple: false },
            { predicate: Predicates.text, asNode: false, required: true, multiple: false },
            { predicate: Predicates.visibilityIsRestricted, asNode: false, required: true, multiple: false },
            { predicate: Predicates.hasQuestionState, asNode: false, required: true, multiple: false },
            { predicate: Predicates.ofTopic, asNode: true, required: true, multiple: false },
            { predicate: Predicates.hasAuthor, asNode: true, required: true, multiple: false },
            { predicate: Predicates.hasComment, asNode: true, required: false, multiple: true },
            { predicate: Predicates.approver, asNode: true, required: false, multiple: false },
            { predicate: Predicates.hasChangeEvent, asNode: true, required: false, multiple: false }
        );
    }

    set name(value) {
        this._setProperty(Predicates.name, new Text(value));
    }

    set text(value) {
        this._setProperty(Predicates.text, new Text(value));
    }

    set visibilityIsRestricted(value) {
        this._setProperty(Predicates.visibilityIsRestricted, new Data(value, "xsd:boolean"));
    }

    set hasQuestionState(value) {
        this._setProperty(Predicates.hasQuestionState, new Text(value));
    }

    set ofTopic(value) {
        this._setProperty(Predicates.ofTopic, new Node(value));
    }

    set hasAuthor(value) {
        this._setProperty(Predicates.hasAuthor, new Node(value));
    }

    set hasComment(value) {
        this._setArrayProperty(Predicates.hasComment, value, Node);
    }

    set approver(value) {
        this._setProperty(Predicates.approver, new Node(value));
    }

    set hasChangeEvent(value) {
        this._setProperty(Predicates.hasChangeEvent, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.about, new Node(data.about));
        this._setNewProperty(Predicates.author, new Node(data.author));
        super._fill(data);
    }
}
