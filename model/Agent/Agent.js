import * as Classes from "../../constants/classes";
import Thing from "../Thing";
import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Messages from "../../constants/messages";
import * as Predicates from "../../constants/predicates";
import { body, param, validationResult } from "express-validator";

export default class Agent extends Thing {
    constructor(uri) {
        super(uri);
        this.type = Classes.Agent;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.agentURI;
        this.predicates.push(
            { predicate: Predicates.name, asNode: false, required: true, multiple: false },
            { predicate: Predicates.avatar, asNode: false, required: false, multiple: false }
        );
    }

    set name(value) {
        this._setProperty(Predicates.name, new Text(value));
    }

    set avatar(value) {
        this._setProperty(Predicates.avatar, new Text(value));
    }

    _fill(data) {
        this._setNewProperty(Predicates.name, data.name);
        this._setNewProperty(Predicates.avatar, data.avatar);
        super._fill(data);
    }

    static validate() {
        return [
            body("name")
                .exists()
                .withMessage(Messages.MISSING_FIELD),
            body("avatar").optional()
        ].concat(Thing.validate());
    }
}
