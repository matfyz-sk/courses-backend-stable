import * as Constants from "../../../../constants";
import * as Classes from "../../../../constants/classes";
import ExaminationEvent from "./ExaminationEvent";

export default class OralExam extends ExaminationEvent {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.oralExamURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.OralExam;
        this.subclassOf = Classes.ExaminationEvent;
    }

    _fill(data) {
        super._fill(data);
    }
}
