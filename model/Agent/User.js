import * as Classes from "../../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import { getNewNode } from "../../helpers";
import { db } from "../../config/client";

export default class User extends Agent {
    constructor(uri) {
        super(uri);
        this.type = Classes.User;
        this.subclassOf = Classes.Agent;
    }

    set firstName(value) {
        this._setProperty("firstName", Predicates.firstName, new Text(value));
    }

    set lastName(value) {
        this._setProperty("lastName", Predicates.lastName, new Text(value));
    }

    set email(value) {
        this._setProperty("email", Predicates.email, new Text(value));
    }

    set description(value) {
        this._setProperty("description", Predicates.description, new Text(value));
    }

    set nickname(value) {
        this._setProperty("nickname", Predicates.nickname, new Text(value));
    }

    set memberOf(value) {
        this._setArrayProperty("memberOf", Predicates.memberOf, value, Node);
    }

    async store() {
        this.subject = await getNewNode(Constants.usersURI);
        this.props.firstName.subj = this.subject;
        this.props.lastName.subj = this.subject;
        this.props.email.subj = this.subject;
        this.props.description.subj = this.subject;
        this.props.nickname.subj = this.subject;
        for (var t of this.props.memberOf) t.subj = this.subject;
        super.store();
    }

    delete() {
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
