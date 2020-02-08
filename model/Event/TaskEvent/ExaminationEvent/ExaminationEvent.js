import * as Constants from "../../../../constants";
import * as Classes from "../../../../constants/classes";
import TaskEvent from "../TaskEvent";

export default class ExaminationEvent extends TaskEvent {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.examinationEventURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.ExaminationEvent;
        this.subclassOf = Classes.TaskEvent;
    }

    _fill(data) {
        super._fill(data);
    }
}
