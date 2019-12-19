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
        this._setProperty("year", Predicates.year, new Text(value));
    }

    set instanceOf(value) {
        this._setProperty("instanceof", Predicates.instanceOf, new Node(value));
    }

    set hasInstructor(value) {
        this._setArrayProperty("hasInstructor", Predicates.hasInstructor, value, Node);
    }

    _fill(data) {
        this.props.year = new Triple(this.subject, Predicates.year, new Text(data[Constants.ontologyURI + "year"]), "nothing");
        this.props.instanceOf = new Triple(
            this.subject,
            Predicates.instanceOf,
            new Node(data[Constants.ontologyURI + "instanceOf"]),
            "nothing"
        );
        this.props.hasInstructor = [];
        for (var uri of data[Constants.ontologyURI + "hasInstructor"]) {
            this.props.hasInstructor.push(new Triple(this.subject, Predicates.hasInstructor, new Node(uri), "nothing"));
        }
        super._fill(data);
    }
}
