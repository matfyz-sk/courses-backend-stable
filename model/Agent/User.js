import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Agent from "./Agent";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import * as Messages from "../../constants/messages";
import { body, param, validationResult } from "express-validator";
import Team from "./Team";
import { predicate } from "../../helpers";

export default class User extends Agent {
    constructor(uri) {
        super(uri);
        this.uri = uri;
        this.type = Classes.User;
        this.subclassOf = Classes.Agent;
        this.uriPrefix = Constants.usersURI;
        this.predicates.push(
            { predicate: Predicates.firstName, asNode: false },
            { predicate: Predicates.lastName, asNode: false },
            { predicate: Predicates.email, asNode: false },
            { predicate: Predicates.description, asNode: false },
            { predicate: Predicates.nickname, asNode: false },
            { predicate: Predicates.memberOf, asNode: true },
            { predicate: Predicates.requests, asNode: true },
            { predicate: Predicates.studentOf, asNode: true }
        );
    }

    set firstName(value) {
        this._setProperty(Predicates.firstName, new Text(value));
    }

    set lastName(value) {
        this._setProperty(Predicates.lastName, new Text(value));
    }

    set email(value) {
        this._setProperty(Predicates.email, new Text(value));
    }

    set description(value) {
        this._setProperty(Predicates.description, new Text(value));
    }

    set nickname(value) {
        this._setProperty(Predicates.nickname, new Text(value));
    }

    set memberOf(value) {
        this._setArrayProperty(Predicates.memberOf, value, Node);
    }

    set requests(value) {
        this._setArrayProperty(Predicates.requests, value, Node);
    }

    set studentOf(value) {
        this._setArrayProperty(Predicates.studentOf, value, Node);
    }

    _fill(data) {
        this._setNewProperty(Predicates.firstName, new Text(data.firstName));
        this._setNewProperty(Predicates.lastName, new Text(data.lastName));
        this._setNewProperty(Predicates.description, new Text(data.description));
        this._setNewProperty(Predicates.email, new Text(data.email));
        this._setNewProperty(Predicates.nickname, new Text(data.nickname));

        this._setNewArrayProperty(Predicates.memberOf, data.memberOf, Node);
        this._setNewArrayProperty(Predicates.requests, data.requests, Node);
        this._setNewArrayProperty(Predicates.studentOf, data.studentOf, Node);

        super._fill(data);
    }

    static validate() {
        const x = [
            body("firstName")
                .exists()
                .withMessage(Messages.MISSING_FIELD)
                .bail()
                .isString()
                .withMessage(Messages.FIELD_NOT_STRING),
            body("lastName")
                .exists()
                .withMessage(Messages.MISSING_FIELD)
                .bail()
                .isString()
                .withMessage(Messages.FIELD_NOT_STRING),
            body("email")
                .exists()
                .withMessage(Messages.MISSING_FIELD)
                .bail()
                .isEmail()
                .withMessage(Messages.FIELD_NOT_EMAIL),
            body("description")
                .exists()
                .withMessage(Messages.MISSING_FIELD),
            body("nickname")
                .exists()
                .withMessage(Messages.MISSING_FIELD)
        ].concat(Agent.validate());
        console.log(x);
        return x;
    }
}
