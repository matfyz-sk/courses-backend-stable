import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import ExaminationEvent from "./ExaminationEvent";

export default class OralExam extends ExaminationEvent {
    constructor(uri) {
        super(uri);
        this.type = Classes.OralExam;
        this.subclassOf = Classes.ExaminationEvent;
    }

    async store() {
        this.subject = await getNewNode(Constants.oralExamURI);
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
