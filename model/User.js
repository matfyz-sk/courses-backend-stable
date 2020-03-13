import { db } from "../config/client";
import lib from "sparql-transformer";
import { Triple, Node, Data, Text } from "virtuoso-sparql-client";

import { User, Team, CourseInstance, Topic } from "../../constants/classes";
import {
    firstName,
    lastName,
    email,
    password,
    description,
    nickname,
    memberOf,
    requests,
    studentOf,
    instructorOf,
    understands,
    useNickName,
    publicProfile,
    showCourses,
    showBadges,
    allowContact
} from "../../constants/predicates";
import { agent } from "./Agent";
import { getTripleObjectType } from "../helpers";

const defaultOptions = {
    context: "http://www.courses.matfyz.sk/ontology#",
    endpoint: virtuosoEndpoint,
    debug: true
};

export class User {
    constructor(userURI) {
        this.userURI = userURI;

        this.props = {
            [firstName.value]: {
                required: false,
                dataType: "string"
            },
            [lastName.value]: {
                required: false,
                dataType: "string"
            },
            [email.value]: {
                required: true,
                dataType: "string"
            },
            [password.value]: {
                required: true,
                dataType: "string"
            },
            [description.value]: {
                required: false,
                dataType: "string"
            },
            [nickname.value]: {
                required: false,
                dataType: "string"
            },
            [publicProfile.value]: {
                required: true,
                dataType: "boolean"
            },
            [showCourses.value]: {
                required: true,
                dataType: "boolean"
            },
            [showBadges.value]: {
                required: true,
                dataType: "boolean"
            },
            [allowContact.value]: {
                required: true,
                dataType: "boolean"
            }
        };

        this.sparqlTransformer = lib.default;
        this.options = defaultOptions;
    }

    async fetch() {
        if (!this.userURI) {
            throw "You must define user URI first to fetch data";
        }

        const query = {
            "@graph": {
                "@id": `<${this.userURI}>`
            },
            $where: [`<${this.userURI}> rdf:type courses:User`]
        };

        Object.keys(this.props).forEach(predicateName => {
            query["@graph"][predicateName] = `$courses:${predicateName}$required`;
        });

        const data = await this.sparqlTransformer(query, this.options);
        if (data["@graph"].length == 0) {
            throw `User with URI ${this.userURI} doesn't exist`;
        }

        Object.keys(this.props).forEach(predicateName => {
            const object = getTripleObjectType(this.props[predicateName].dataType, data["@graph"][0][predicateName]);
            this.props[predicateName].value = new Triple(new Node(this.userURI), `courses:${predicateName}`, object, "nothing");
        });
    }

    setPredicate(predicateName, objectValue) {
        const object = getTripleObjectType(this.props[predicateName].dataType, objectValue);
        if (this.props[predicateName].value == undefined) {
            this.props[predicateName].value = new Triple(new Node(this.userURI), `courses:${predicateName}`, object);
        } else {
            this.props[predicateName].setOperation(Triple.ADD);
            this.props[predicateName].updateObject(object);
        }
    }
}
