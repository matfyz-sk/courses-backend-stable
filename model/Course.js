import * as Classes from "../constants/classes";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { getNewNode } from "../helpers";

export default class Course extends Thing {
    constructor(uri) {
        super();
        this.type = Classes.Course;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.coursesURI;
    }

    set name(value) {
        this._setProperty("name", Predicates.name, new Text(value));
    }

    set description(value) {
        this._setProperty("description", Predicates.description, new Text(value));
    }

    set abbreviation(value) {
        this._setProperty("abbreviation", Predicates.abbreviation, new Text(value));
    }

    set hasPrerequisite(value) {
        this._setProperty("hasPrerequisite", Predicates.hasPrerequisite, new Node(value));
    }

    set mentions(value) {
        this._setArrayProperty("mentions", Predicates.mentions, value, Node);
    }

    set covers(value) {
        this._setArrayProperty("covers", Predicates.covers, value, Node);
    }

    _fill(data) {}
}
