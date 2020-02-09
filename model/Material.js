import * as Classes from "../constants/classes";
import { Node } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";

export default class Material extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.materialURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Material;
        this.subclassOf = Classes.Thing;
    }
}
