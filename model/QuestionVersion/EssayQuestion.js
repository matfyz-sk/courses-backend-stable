import * as Classes from "../../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import * as Constants from "../../constants";
import * as Predicates from "../../constants/predicates";
import QuestionVersion from "./QuestionVersion";

export default class EssayQuestion extends QuestionVersion {
    constructor(uri) {
        super(uri);
        this.type = Classes.EssayQuestion;
        this.subclassOf = Classes.QuestionVersion;
        this.uriPrefix = Constants.essayQuestionURI;
    }

    _fill(data) {
        super._fill(data);
    }
}
