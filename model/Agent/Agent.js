import * as Classes from "../../constants/classes";
import Thing from "../Thing";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Messages from "../../constants/messages";
import * as Predicates from "../../constants/predicates";
import { body, param, validationResult } from "express-validator";

export default class Agent extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.agentURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Agent;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.name.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.avatar.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.reviews.value] = { required: false, multiple: true, type: Node, primitive: false };
    }
}
