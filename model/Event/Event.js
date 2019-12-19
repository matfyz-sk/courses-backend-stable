import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Thing from "../Thing";

export default class Event extends Thing {
    constructor(uri) {
        super(uri);
    }

    set startDate(value) {
        this._setProperty("startDate", Predicates.startDate, new Text(value));
    }

    set endDate(value) {
        this._setProperty("endDate", Predicates.endDate, new Text(value));
    }

    async store() {
        this.props.startDate.subj = this.subject;
        this.props.endDate.subj = this.subject;
        super.store();
    }

    delete() {
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
