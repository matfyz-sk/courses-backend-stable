import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Event from "./Event";

export default class CourseInstance extends Event {
    constructor(uri) {
        super(uri);
        this.type = Classes.CourseInstance;
        this.subclassOf = Classes.Event;
        this.uriPrefix = Constants.courseInstancesURI;
    }

    set year(value) {
        this._setProperty(Predicates.year, new Text(value));
    }

    set instanceOf(value) {
        this._setProperty(Predicates.instanceOf, new Node(value));
    }

    set hasInstructor(value) {
        this._setArrayProperty(Predicates.hasInstructor, value, Node);
    }

    _fill(data) {
        this._setNewProperty(Predicates.year, new Text(data.year));
        this._setNewProperty(Predicates.instanceOf, new Node(data.instanceOf));
        this._setNewArrayProperty(Predicates.hasInstructor, data.hasInstructor, Node);
        super._fill(data);
    }
}
