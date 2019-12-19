import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import Event from "../Event";

export default class Session extends Event {
    constructor(uri) {
        super(uri);
    }

    set courseInstance(value) {
        this._setProperty("courseInstace", Predicates.courseInstance, new Node(value));
    }

    set hasInstructor(value) {
        this._setArrayProperty("hasInstructor", Predicates.hasInstructor, value, Node);
    }

    _fill(data) {
        this.props.courseInstance = new Triple(
            this.subject,
            Predicates.courseInstance,
            new Node(data[Constants.ontologyURI + "courseInstance"]),
            "nothing"
        );
        this.props.hasInstructor = [];
        for (var uri of data[Constants.ontologyURI + "hasInstructor"]) {
            this.props.hasInstructor.push(new Triple(this.subject, Predicates.hasInstructor, new Node(uri), "nothing"));
        }
        super._fill(data);
    }
}
