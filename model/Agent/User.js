import { User } from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
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

export const user = {
    type: User,
    subclassOf: agent,
    props: {
        [firstName.value]: {
            required: true,
            multiple: false,
            type: Text,
            primitive: true
        },
        [lastName.value]: {
            required: true,
            multiple: false,
            type: Text,
            primitive: true
        },
        [email.value]: {
            required: true,
            multiple: false,
            type: Text,
            primitive: true
        },
        [password.value]: {
            required: true,
            multiple: false,
            type: Text,
            primitive: true
        },
        [description.value]: {
            required: false,
            multiple: false,
            type: Text,
            primitive: true
        },
        [nickname.value]: {
            required: false,
            multiple: false,
            type: Text,
            primitive: true
        },

        [publicProfile.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        },
        [showCourses.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        },
        [showBadges.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        },
        [allowContact.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        },

        [memberOf.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        },
        [requests.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        },
        [studentOf.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        },
        [instructorOf.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        },
        [understands.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        },
        [useNickName.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:boolean",
            primitive: true
        }
    }
};
