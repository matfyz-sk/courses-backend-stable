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
        this.predicates.push({ predicate: Predicates.courseInstance, asNode: true, required: true, multiple: false });
    }

    set courseInstance(value) {
        this._setProperty(Predicates.courseInstance, new Node(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.courseInstance, data.courseInstance);
        super._fill(data);
    }

    static validate() {
        return [
            body("courseInstance")
                .exists()
                .withMessage(Messages.MISSING_FIELD)
                .bail()
                .isURL()
                .bail()
                .custom(value => resourceExists(value, Classes.CourseInstance))
        ].concat(super.validate());
    }
}
