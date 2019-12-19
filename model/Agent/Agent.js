import * as Classes from "../../constants/classes";
import Thing from "../Thing";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class Agent extends Thing {
    constructor(uri) {
        super(uri);
    }

    set name(value) {
        this._setProperty("name", Predicates.name, new Text(value));
    }

    set avatar(value) {
        this._setProperty("avatar", Predicates.avatar, new Text(value));
    }

    store() {
        this.props.name.subj = this.subject;
        this.props.avatar.subj = this.subject;
        super.store();
    }

    delete() {
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
