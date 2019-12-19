import * as Classes from "../constants/classes";
import Thing from "./Thing";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { timingSafeEqual } from "crypto";

export default class Agent extends Thing {
    constructor(uri) {
        super();
        this.subject = new Node(uri);
        // this._uri = uri;
        // this._type = Classes.Agent;
        this.props = {};
    }

    set name(value) {
        if (!this.props.name) this.props.name = new Triple(this.subject, Predicates.name, new Text(value));
        else this.props.name.updateObject(new Text(value));
    }

    set avatar(value) {
        if (!this.props.avatar) this.props.avatar = new Triple(this.subject, Predicates.avatar, new Text(value));
        else this.props.avatar.updateObject(new Text(value));
    }

    store() {
        this.props.name.subj = this.subject;
        this.props.avatar.subj = this.subject;
        super.store();
    }

    delete() {
        this.props.name.subj = this.subject;
        this.props.avatar.subj = this.subject;
        this.props.name.setOperation(Triple.REMOVE);
        this.props.avatar.setOperation(Triple.REMOVE);
        super.delete();
    }

    patch() {
        super.patch();
    }

    put() {}

    _fill(data) {
        this.props.name = new Triple(this.subject, Predicates.name, new Text(data[Constants.ontologyURI + "name"]), "nothing");
        this.props.avatar = new Triple(this.subject, Predicates.avatar, new Text(data[Constants.ontologyURI + "avatar"]), "nothing");
        super._fill(data);
    }
}
