import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import Event from "../Event";

export default class TaskEvent extends Event {
    constructor(uri) {
        super(uri);
        this.type = Classes.TaskEvent;
        this.subclassOf = Classes.Event;
    }

    set extraTime(value) {
        this._setProperty("extraTime", Predicates.extraTime, value);
    }

    set task(value) {
        this._setProperty("task", Predicates.task, value);
    }

    async store() {
        // this.subject = await getNewNode(Constants.taskEventURI);
        this.props.extraTime.subj = this.subject;
        this.props.task.subj = this.subject;
        super.store();
    }

    delete() {
        this.props.extraTime.setOperation(Triple.REMOVE);
        this.props.task.setOperation(Triple.REMOVE);
        super.delete();
    }

    patch() {
        super.patch();
    }

    put() {}

    _fill(data) {
        this.props.extraTime = new Triple(
            this.subject,
            Predicates.extraTime,
            new Text(data[Constants.ontologyURI + "extraTime"]),
            "nothing"
        );
        this.props.task = new Triple(this.subject, Predicates.task, new Text(data[Constants.ontologyURI + "task"]), "nothing");
        super._fill(data);
    }
}
