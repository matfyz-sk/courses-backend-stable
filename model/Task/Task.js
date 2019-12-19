import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Thing from "../Thing";

export default class Task extends Thing {
    constructor(uri) {
        super(uri);
        this.subject = new Node(uri);
        this._uri = uri;
        this.props = {};
    }

    set covers(value) {
        if (this.props.covers) for (var t of this.props.covers) t.setOperation(Triple.REMOVE);
        else this.props.covers = [];
        for (var uri of value) this.props.covers.push(new Triple(this.subject, Predicates.covers, new Node(uri)));
    }

    set mentions(value) {
        if (this.props.mentions) for (var t of this.props.mentions) t.setOperation(Triple.REMOVE);
        else this.props.mentions = [];
        for (var uri of value) this.props.mentions.push(new Triple(this.subject, Predicates.mentions, new Node(uri)));
    }

    set requires(value) {
        if (this.props.requires) for (var t of this.props.requires) t.setOperation(Triple.REMOVE);
        else this.props.requires = [];
        for (var uri of value) this.props.requires.push(new Triple(this.subject, Predicates.requires, new Node(uri)));
    }

    async store() {
        this.props.startDate.subj = this.subject;
        this.props.endDate.subj = this.subject;
        super.store();
    }

    delete() {
        this.props.startDate.subj = this.subject;
        this.props.endDate.subj = this.subject;
        this.props.startDate.setOperation(Triple.REMOVE);
        this.props.endDate.setOperation(Triple.REMOVE);
        super.delete();
    }

    patch() {
        super.patch();
    }

    put() {}

    _fill(data) {
        this.props.startDate = new Triple(
            this.subject,
            Predicates.startDate,
            new Text(data[Constants.ontologyURI + "startDate"]),
            "nothing"
        );
        this.props.endDate = new Triple(this.subject, Predicates.endDate, new Text(data[Constants.ontologyURI + "endDate"]), "nothing");
        super._fill(data);
    }
}
