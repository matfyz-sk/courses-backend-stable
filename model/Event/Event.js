import { Event } from "../../constants/classes";
import {
    name,
    location,
    description,
    startDate,
    endDate,
    uses,
    recommends,
    covers,
    mentions,
    requires,
    courseInstance
} from "../../constants/predicates";

export const event = {
    type: Event,
    subclasses: ["courseInstance", "block", "session", "taskEvent"],
    props: {
        [name.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [location.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [description.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        [startDate.value]: {
            required: true,
            multiple: false,
            dataType: "dateTime"
        },
        [endDate.value]: {
            required: true,
            multiple: false,
            dataType: "dateTime"
        },
        [uses.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material"
        },
        [recommends.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material"
        },
        [covers.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        },
        [mentions.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        },
        [requires.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic"
        }
        // [courseInstance.value]: {
        //     required: true,
        //     multiple: false,
        //     dataType: "node",
        //     objectClass: CourseInstance
        // }
    },
    createPolicy: ["courseInstance.^courses:instructorOf.{userURI}"]
};
