import { User } from "../../constants/classes";
import {
    firstName,
    lastName,
    email,
    password,
    description,
    nickname,
    publicProfile,
    showCourses,
    showBadges,
    allowContact,
    useNickName
} from "../../constants/predicates";

export const userProfile = {
    type: User,
    props: {
        [firstName.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [lastName.value]: {
            required: true,
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
            required: true,
            multiple: false,
            dataType: "string"
        },
        [nickname.value]: {
            required: true,
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
        [useNickName.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        }
    }
};
