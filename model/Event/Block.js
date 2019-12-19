import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Event from "./Event";

export default class Block extends Event {
    constructor(uri) {
        super(uri);
        this.type = Classes.Block;
        this.subclassOf = Classes.Event;
    }

    async store() {
        this.subject = await getNewNode(Constants.courseInstancesURI);
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
