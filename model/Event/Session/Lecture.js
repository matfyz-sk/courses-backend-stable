import * as Classes from "../../../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Session from "./Session";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import { getNewNode } from "../../../helpers";

export default class Lecture extends Session {
    constructor(uri) {
        super();
        this.type = Classes.Lecture;
        this.subclassOf = Classes.Session;
        this.uriPrefix = Constants.lectureURI;
    }

    set room(value) {
        this._setProperty("room", Predicates.room, new Text(value));
    }

    _fill(data) {
        this.props.room = new Triple(this.subject, Predicates.room, new Text(data[Constants.ontologyURI + "room"]), "nothing");
        super._fill(data);
    }
}
