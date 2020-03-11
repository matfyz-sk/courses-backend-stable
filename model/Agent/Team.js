import { Node } from "virtuoso-sparql-client";
import { courseInstance } from "../../constants/predicates";
import { agent } from "./Agent";
import { Team, CourseInstance } from "../../constants/classes";

export const team = {
    type: Team,
    subclassOf: agent,
    props: {
        [courseInstance.value]: {
            required: true,
            multiple: false,
            change: false,
            dataType: "node",
            objectClass: "courseInstance"
        }
    },
    createPolicy: [
        // musi byt studentom kurzu
        // nesmie byt uz clenom nejakeho timu v tomto kurze
        "courseInstance:^memberOf:{userURI}",
        "-({userURI}:memberOf:?teamURI)"
    ]
};
