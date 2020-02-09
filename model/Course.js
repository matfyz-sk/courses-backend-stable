import * as Classes from "../constants/classes";
import { Node, Text } from "virtuoso-sparql-client";
import Thing from "./Thing";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";

export default class Course extends Thing {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.coursesURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.Course;
        this.subclassOf = Classes.Thing;
        this.props[Predicates.name.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.description.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.abbreviation.value] = { required: false, multiple: false, type: Text, primitive: true };
        this.props[Predicates.hasPrerequisite.value] = { required: false, multiple: true, type: Node, primitive: false };
        this.props[Predicates.mentions.value] = { required: false, multiple: true, type: Node, primitive: false };
        this.props[Predicates.covers.value] = { required: false, multiple: true, type: Node, primitive: false };
    }
}
