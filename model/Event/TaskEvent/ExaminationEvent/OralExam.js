import * as Constants from "../../../../constants";
import ExaminationEvent from "./ExaminationEvent";

export default class OralExam extends ExaminationEvent {
    constructor(uri) {
        super(uri);
        this.type = Classes.OralExam;
        this.subclassOf = Classes.ExaminationEvent;
        this.uriPrefix = Constants.oralExamURI;
    }

    _fill(data) {
        super._fill(data);
    }
}
