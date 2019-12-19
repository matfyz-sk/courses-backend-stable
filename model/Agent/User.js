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
        this.uriPrefix = Constants.usersURI;
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

    set requests(value) {
        this._setArrayProperty("requests", Predicates.requests, value, Node);
    }

    set studentOf(value) {
        this._setArrayProperty("studentOf", Predicates.studentOf, value, Node);
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
        this.props.requests = [];
        this.props.studentOf = [];

        for (var uri of data[Constants.ontologyURI + "memberOf"]) {
            this.props.memberOf.push(new Triple(this.subject, Predicates.memberOf, new Node(uri), "nothing"));
        }
        for (var uri of data[Constants.ontologyURI + "requests"]) {
            this.props.requests.push(new Triple(this.subject, Predicates.requests, new Node(uri), "nothing"));
        }
        for (var uri of data[Constants.ontologyURI + "studentOf"]) {
            this.props.studentOf.push(new Triple(this.subject, Predicates.studentOf, new Node(uri), "nothing"));
        }

        super._fill(data);
    }
}
