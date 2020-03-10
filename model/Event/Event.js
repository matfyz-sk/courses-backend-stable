import { Event, Material, Topic, CourseInstance } from "../../constants/classes";
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
            objectClass: Material
        },
        [recommends.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Material
        },
        [covers.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Topic
        },
        [mentions.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Topic
        },
        [requires.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: Topic
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
