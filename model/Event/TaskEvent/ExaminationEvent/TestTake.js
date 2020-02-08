import { Node } from "virtuoso-sparql-client";
import * as Constants from "../../../../constants";
import * as Classes from "../../../../constants/classes";
import ExaminationEvent from "./ExaminationEvent";

export default class TestTake extends ExaminationEvent {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.testTakeURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.TestTake;
        this.subclassOf = Classes.ExaminationEvent;
    }

    _fill(data) {
        super._fill(data);
    }
}
