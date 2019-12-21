import * as Classes from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class Material extends Thing {
    constructor(uri) {
        super();
        this.type = Classes.Material;
        this.subclassOf = Classes.Thing;
        this.uriPrefix = Constants.materialURI;
    }

    _fill(data) {
        super._fill(data);
    }
}
