import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import * as Messages from "../../constants/messages";
import { body, param, validationResult } from "express-validator";

export default class User extends Agent {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.usersURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.User;
        this.subclassOf = Classes.Agent;
        this.props[Predicates.firstName.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.lastName.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.email.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.description.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.nickname.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.memberOf.value] = { required: false, multiple: true, type: Node, primitive: false };
        this.props[Predicates.requests.value] = { required: false, multiple: true, type: Node, primitive: false };
        this.props[Predicates.studentOf.value] = { required: false, multiple: true, type: Node, primitive: false };
        this.props[Predicates.understands.value] = { required: false, multiple: true, type: Node, primitive: false };
        this.props[Predicates.useNickName.value] = { required: false, multiple: true, type: Node, primitive: false };
    }
}
