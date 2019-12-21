import { Client, Triple, Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import Event from "./Event";

export default class Block extends Event {
    constructor(uri) {
        super(uri);
        this.type = Classes.Block;
        this.subclassOf = Classes.Event;
        this.uriPrefix = Constants.blockURI;
    }

    _fill(data) {
        super._fill(data);
    }
}
