import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Event from "./Event";

export default class CourseInstance extends Event {
    constructor(uri) {
        super(uri);
        this.type = Classes.CourseInstance;
        this.subclassOf = Classes.Event;
    }

    set instanceOf(value) {
        this._setProperty("instanceof", Predicates.instanceOf, new Node(value));
    }

    set hasInstructor(value) {
        this._setArrayProperty("hasInstructor", Predicates.hasInstructor, value, Node);
    }

    async store() {
        this.subject = await getNewNode(Constants.courseInstancesURI);
        this.props.instanceOf.subj = this.subject;
        for (var t of this.props.hasInstructor) t.subj = this.subject;
        super.store();
    }

    delete() {
        this.props.instanceOf.setOperation(Triple.REMOVE);
        for (var t of this.props.hasInstructor) t.setOperation(Triple.REMOVE);
        super.delete();
    }

    patch() {
        super.patch();
    }

    put() {}

    _fill(data) {
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
