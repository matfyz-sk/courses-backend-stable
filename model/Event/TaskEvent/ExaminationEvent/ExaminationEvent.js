import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../../constants";
import * as Predicates from "../../../constants/predicates";
import TaskEvent from "../TaskEvent";

export default class ExaminationEvent extends TaskEvent {
    constructor(uri) {
        super(uri);
    }

    _fill(data) {
        super._fill(data);
    }
}
