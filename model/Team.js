import * as Classes from "../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { getNewNode } from "../helpers";

export default class Team extends Agent {
    constructor(uri) {
        super();
        this.subject = new Node(uri);
        this._uri = uri;
        this.props = {};
    }

    set courseInstance(value) {
        if (!this.props.courseInstance) {
            this.props.courseInstance = new Triple(this.subject, Predicates.courseInstance, new Node(value));
        } else {
            this.props.courseInstance.setOperation(Triple.ADD);
            this.props.courseInstance.updateObject(new Node(value));
        }
    }

    async store() {
        this.subject = await getNewNode(Constants.teamsURI);
        this.props.type = new Triple(this.subject, Predicates.type, Classes.Team);
        this.props.subclassOf = new Triple(this.subject, Predicates.subclassOf, Classes.Agent);
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

    async fetch() {
        const client = this.getClientInstance();
        const data = await client.query(`SELECT ?s ?p ?o WHERE {?s ?p ?o} VALUES ?s {<${this._uri}>}`, true);

        var actualData = {};
        for (var row of data.results.bindings) {
            const predicate = row.p.value;
            const object = row.o.value;
            if (actualData[predicate]) {
                if (Array.isArray(actualData[predicate])) {
                    actualData[predicate].push(object);
                } else {
                    actualData[predicate] = [actualData[predicate], object];
                }
                continue;
            }
            actualData[predicate] = object;
        }
        this._fill(actualData);
    }

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
