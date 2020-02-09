import * as Classes from "../../constants/classes";
import * as Constants from "../../constants";
import Question from "./Question";
import { Node } from "virtuoso-sparql-client";

export default class EssayQuestion extends Question {
    constructor(id) {
        super(id);
        this.uriPrefix = Constants.essayQuestionURI;
        this.subject = new Node(this.uriPrefix + this.id);
        this.type = Classes.EssayQuestion;
        this.subclassOf = Classes.Question;
    }
}
