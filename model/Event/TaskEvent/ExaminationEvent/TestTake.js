import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import ExaminationEvent from "./ExaminationEvent";

export default class TestTake extends ExaminationEvent {
    constructor(uri) {
        super(uri);
        this.type = Classes.TestTake;
        this.subclassOf = Classes.ExaminationEvent;
        this.uriPrefix = Constants.testTakeURI;
    }

    _fill(data) {
        super._fill(data);
    }
}
