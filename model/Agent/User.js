import { User } from "../../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import {
    firstName,
    lastName,
    email,
    description,
    nickname,
    memberOf,
    requests,
    studentOf,
    understands,
    useNickName
} from "../../constants/predicates";
import { agent } from "./Agent";

export const user = {
    type: User,
    subclassOf: agent,
    props: {
        [firstName.value]: {
            required: false,
            multiple: false,
            type: Text,
            primitive: true
        },
        [lastName.value]: {
            required: false,
            multiple: false,
            type: Text,
            primitive: true
        },
        [email.value]: {
            required: false,
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
        [understands.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        },
        [useNickName.value]: {
            required: false,
            multiple: true,
            type: Node,
            primitive: false
        }
    }
};
