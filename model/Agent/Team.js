import * as Classes from "../../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class Team extends Agent {
    constructor(uri) {
        super(uri);
        this.type = Classes.Team;
        this.subclassOf = Classes.Agent;
        this.uriPrefix = Constants.teamsURI;
    }

    set courseInstance(value) {
        this._setProperty(Predicates.courseInstance, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.courseInstance, data.courseInstance);
        super._fill(data);
    }
}
