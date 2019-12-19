import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import TaskEvent from "./TaskEvent";

export default class AssignmentPeriod extends TaskEvent {
    constructor(uri) {
        super(uri);
        this.type = Classes.AssignmentPeriod;
        this.subclassOf = Classes.TaskEvent;
    }

    async store() {
        this.subject = await getNewNode(Constants.assignmentPeriodURI);
        super.store();
    }

    delete() {
        super.delete();
    }

    patch() {
        super.patch();
    }

    put() {}

    _fill(data) {
        super._fill(data);
    }
}
