import { Node } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Classes from "../../../constants/classes";
import TaskEvent from "./TaskEvent";

export default class AssignmentPeriod extends TaskEvent {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.assignmentPeriodURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.AssignmentPeriod;
        this.subclassOf = Classes.TaskEvent;
    }

    _fill(data) {
        super._fill(data);
    }
}
