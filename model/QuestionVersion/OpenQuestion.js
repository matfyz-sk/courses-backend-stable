import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import QuestionVersion from "./QuestionVersion";

export default class OpenQuestion extends QuestionVersion {
    constructor(uri) {
        super(uri);
        this.type = Classes.OpenQuestion;
        this.subclassOf = Classes.QuestionVersion;
        this.uriPrefix = Constants.openQuestionURI;
    }

    _fill(data) {
        super._fill(data);
    }
}
