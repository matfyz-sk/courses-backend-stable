import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import Thing from "./Thing";

export default class Event extends Thing {
    constructor() {
        super();
        this._uri = "";
        this._type = "courses:Event";
        this._subclassOf = "courses:Thing";
        this._prefix = "http://www.courses.matfyz.sk/data/event/";
    }
    set startDate(value) {
        if (this._startDate) {
            this._old._startDate = this._startDate;
        }
        this._startDate = value;
    }
    set endDate(value) {
        if (this._endDate) {
            this._old._endDate = this._endDate;
        }
        this._endDate = value;
    }
    delete(subject, triples) {
        triples.push(
            new Triple(subject, Predicates.startDate, new Text(this._old._startDate), Triple.REMOVE),
            new Triple(subject, Predicates.endDate, new Text(this._old._endDate), Triple.REMOVE)
        );

        super.delete(subject, triples);
    }
    update(subject, triples) {
        var t1 = new Triple(subject, Predicates.startDate, new Text(this._old._startDate));
        t1.updateObject(new Text(this._startDate));

        var t2 = new Triple(subject, Predicates.endDate, new Text(this._old._endDate));
        t2.updateObject(new Text(this._endDate));

        triples.push(t1, t2);

        super.update(subject, triples);
    }
    async store(subject, triples) {
        triples.push(
            new Triple(subject, Predicates.startDate, new Text(this._startDate)),
            new Triple(subject, Predicates.endDate, new Text(this._endDate))
        );
        return await super.store(subject, triples);
    }
    _fill(data) {
        this._startDate = data[Constants.ontologyURI + "startDate"];
        this._endDate = data[Constants.ontologyURI + "endDate"];
        this._old._startDate = data[Constants.ontologyURI + "startDate"];
        this._old._endDate = data[Constants.ontologyURI + "endDate"];
        super._fill(data);
    }
}
