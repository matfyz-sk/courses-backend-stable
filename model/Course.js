import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class Course extends Thing {
    constructor(uri) {
        super();
        this.type = Classes.Course;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.coursesURI;
    }

    set name(value) {
        this._setProperty(Predicates.name, new Text(value));
    }

    set description(value) {
        this._setProperty(Predicates.description, new Text(value));
    }

    set abbreviation(value) {
        this._setProperty(Predicates.abbreviation, new Text(value));
    }

    set hasPrerequisite(value) {
        this._setProperty(Predicates.hasPrerequisite, new Node(value));
    }

    set mentions(value) {
        this._setArrayProperty(Predicates.mentions, value, Node);
    }

    set covers(value) {
        this._setArrayProperty(Predicates.covers, value, Node);
    }

    _fill(data) {
        this._setNewProperty(Predicates.name, new Text(data.name));
        this._setNewProperty(Predicates.description, new Text(data.description));
        this._setNewProperty(Predicates.abbreviation, new Text(data.abbreviation));
        this._setNewProperty(Predicates.hasPrerequisite, new Text(data.hasPrerequisite));

        this._setArrayProperty(Predicates.mentions, data.mentions, Node);
        this._setArrayProperty(Predicates.covers, data.covers, Node);

        super._fill(data);
    }
}
