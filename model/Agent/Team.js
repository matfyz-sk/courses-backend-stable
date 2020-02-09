import * as Classes from "../../constants/classes";
import { Triple, Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";

export default class Team extends Agent {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.teamsURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Team;
        this.subclassOf = Classes.Agent;
        this.props[Predicates.courseInstance.value] = { required: false, multiple: false, type: Node, primitive: false };
    }
}
