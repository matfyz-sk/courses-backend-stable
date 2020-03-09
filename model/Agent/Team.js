import { Node } from "virtuoso-sparql-client";
import { courseInstance } from "../../constants/predicates";
import { agent } from "./Agent";
import { Team } from "../../constants/classes";

export const team = {
    type: Team,
    subclassOf: agent,
    props: {
        [courseInstance.value]: {
            required: true, // povinny udaj pri vytvarani
            multiple: false, // viacero hodnot
            type: Node,
            primitive: false,
            change: false // neda sa neskor menit
        }
    },
    createPolicy: [
        // musi byt studentom kurzu
        // nesmie byt uz clenom nejakeho timu v tomto kurze
        "courseInstance:^memberOf:{userURI}",
        "-({userURI}:memberOf:?teamURI)"
    ]
};
