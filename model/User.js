import * as Classes from "../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { getNewNode } from "../helpers";
import { db } from "../config/client";

export default class User extends Agent {
    constructor(uri) {
        super();
        this.subject = new Node(uri);
        this._uri = uri;
        this.type = new Triple(this.subject, Predicates.type, Classes.User);
        this.subclassOf = new Triple(this.subject, Predicates.subclassOf, Classes.Agent);
        this.props = {
            type: new Triple(this.subject, Predicates.type, Classes.User),
            subclassOf: new Triple(this.subject, Predicates.subclassOf, Classes.Agent)
        };
    }

    set firstName(value) {
        if (!this.props.firstName) {
            this.props.firstName = new Triple(this.subject, Predicates.firstName, new Text(value));
        } else {
            this.props.firstName.setOperation(Triple.ADD);
            this.props.firstName.updateObject(new Text(value));
        }
    }

    set lastName(value) {
        if (!this.props.lastName) this.props.lastName = new Triple(this.subject, Predicates.lastName, new Text(value));
        else this.props.lastName.updateObject(new Text(value));
    }

    set email(value) {
        if (!this.props.email) this.props.email = new Triple(this.subject, Predicates.email, new Text(value));
        else this.props.email.updateObject(new Text(value));
    }

    set description(value) {
        if (!this.props.description) this.props.description = new Triple(this.subject, Predicates.description, new Text(value));
        else this.props.description.updateObject(new Text(value));
    }

    set nickname(value) {
        if (!this.props.nickname) this.props.nickname = new Triple(this.subject, Predicates.nickname, new Text(value));
        else this.props.nickname.updateObject(new Text(value));
    }

    set memberOf(value) {
        // pole URI timov
        if (this.props.memberOf)
            // nastavenie, aby sa zmazali stare trojice
            for (var t of this.props.memberOf) t.setOperation(Triple.REMOVE);
        else this.props.memberOf = [];
        // pridanie novych trojic ktore sa vlozia
        for (var uri of value) this.props.memberOf.push(new Triple(this.subject, Predicates.memberOf, new Node(uri)));
    }

    async store() {
        this.subject = await getNewNode(Constants.usersURI);
        this.props.type.subj = this.subject;
        this.props.subclassOf.subj = this.subject;
        this.props.firstName.subj = this.subject;
        this.props.lastName.subj = this.subject;
        this.props.email.subj = this.subject;
        this.props.description.subj = this.subject;
        this.props.nickname.subj = this.subject;
        for (var t of this.props.memberOf) t.subj = this.subject;
        super.store();
    }

    delete() {
        this.props.type.setOperation(Triple.REMOVE);
        this.props.subclassOf.setOperation(Triple.REMOVE);
        this.props.firstName.setOperation(Triple.REMOVE);
        this.props.lastName.setOperation(Triple.REMOVE);
        this.props.email.setOperation(Triple.REMOVE);
        this.props.description.setOperation(Triple.REMOVE);
        this.props.nickname.setOperation(Triple.REMOVE);
        for (var t of this.props.memberOf) t.setOperation(Triple.REMOVE);
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
        this.props.firstName = new Triple(
            this.subject,
            Predicates.firstName,
            new Text(data[Constants.ontologyURI + "firstName"]),
            "nothing"
        );
        this.props.lastName = new Triple(this.subject, Predicates.lastName, new Text(data[Constants.ontologyURI + "lastName"]), "nothing");
        this.props.description = new Triple(
            this.subject,
            Predicates.description,
            new Text(data[Constants.ontologyURI + "description"]),
            "nothing"
        );
        this.props.email = new Triple(this.subject, Predicates.email, new Text(data[Constants.ontologyURI + "email"]), "nothing");
        this.props.nickname = new Triple(this.subject, Predicates.nickname, new Text(data[Constants.ontologyURI + "nickname"]), "nothing");
        this.props.memberOf = [];
        for (var uri of data[Constants.ontologyURI + "memberOf"]) {
            this.props.memberOf.push(new Triple(this.subject, Predicates.memberOf, new Node(uri), "nothing"));
        }
        super._fill(data);
    }
}
