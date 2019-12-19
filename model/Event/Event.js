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

    set uses(value) {
        this._setArrayProperty("uses", Predicates.uses, value, Node);
    }

    set recommends(value) {
        this._setArrayProperty("recommends", Predicates.recommends, value, Node);
    }

    set covers(value) {
        this._setArrayProperty("covers", Predicates.covers, value, Node);
    }

    set mentions(value) {
        this._setArrayProperty("mentions", Predicates.mentions, value, Node);
    }

    set requires(value) {
        this._setArrayProperty("requires", Predicates.requires, value, Node);
    }

    _fill(data) {
        this.props.startDate = new Triple(
            this.subject,
            Predicates.startDate,
            new Text(data[Constants.ontologyURI + "startDate"]),
            "nothing"
        );
        this.props.endDate = new Triple(this.subject, Predicates.endDate, new Text(data[Constants.ontologyURI + "endDate"]), "nothing");

        this.props.uses = [];
        this.props.recommends = [];
        this.props.covers = [];
        this.props.mentions = [];
        this.props.requires = [];

        for (var uri of data[Constants.ontologyURI + "uses"]) {
            this.props.uses.push(new Triple(this.subject, Predicates.uses, new Node(uri), "nothing"));
        }

        for (var uri of data[Constants.ontologyURI + "recommends"]) {
            this.props.recommends.push(new Triple(this.subject, Predicates.recommends, new Node(uri), "nothing"));
        }

        for (var uri of data[Constants.ontologyURI + "covers"]) {
            this.props.covers.push(new Triple(this.subject, Predicates.covers, new Node(uri), "nothing"));
        }

        for (var uri of data[Constants.ontologyURI + "mentions"]) {
            this.props.mentions.push(new Triple(this.subject, Predicates.mentions, new Node(uri), "nothing"));
        }

        for (var uri of data[Constants.ontologyURI + "requires"]) {
            this.props.requires.push(new Triple(this.subject, Predicates.requires, new Node(uri), "nothing"));
        }

        super._fill(data);
    }
}
