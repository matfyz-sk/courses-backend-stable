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

export const user = {
    type: User,
    subclassOf: agent,
    props: {
        [firstName.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [lastName.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [email.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [password.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [description.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [nickname.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [publicProfile.value]: {
            required: true,
            multiple: false,
            dataType: "boolean"
        },
        [showCourses.value]: {
            required: true,
            multiple: false,
            dataType: "boolean"
        },
        [showBadges.value]: {
            required: true,
            multiple: false,
            dataType: "boolean"
        },
        [allowContact.value]: {
            required: true,
            multiple: false,
            dataType: "boolean"
        },
        [memberOf.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Team
        },
        [requests.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: CourseInstance
        },
        [studentOf.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "courseInstance" // ako resource
        },
        [instructorOf.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: CourseInstance
        },
        [understands.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Topic
        },
        [useNickName.value]: {
            required: false,
            multiple: true,
            dataType: "boolean"
        }
    }
};
