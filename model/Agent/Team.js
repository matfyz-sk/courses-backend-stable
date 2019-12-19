import * as Classes from "../../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import { getNewNode } from "../../helpers";

export default class Team extends Agent {
    constructor(uri) {
        super(uri);
        this.type = Classes.Team;
        this.subclassOf = Classes.Agent;
    }

    set courseInstance(value) {
        this._setProperty("courseInstance", Predicates.courseInstance, new Node(value));
    }

    async store() {
        this.subject = await getNewNode(Constants.teamsURI);
        this.props.courseInstance.subj = this.subject;
        super.store();
    }

    delete() {
        this.props.type = new Triple(this.subject, Predicates.type, Classes.Team, Triple.REMOVE);
        this.props.subclassOf = new Triple(this.subject, Predicates.subclassOf, Classes.Agent, Triple.REMOVE);
        this.props.courseInstance.setOperation(Triple.REMOVE);
        super.delete();
    }

    patch() {
        super.patch();
    }

    put() {}

    _fill(data) {
        this.props.courseInstance = new Triple(
            this.subject,
            Predicates.courseInstance,
            new Node(data[Constants.ontologyURI + "courseInstance"]),
            "nothing"
        );
        super._fill(data);
    }
}
