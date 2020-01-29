import * as Classes from "../../constants/classes";
import * as Constants from "../../constants";
import Question from "./Question";

export default class EssayQuestion extends Question {
    constructor(uri) {
        super(uri);
        this.type = Classes.EssayQuestion;
        this.subclassOf = Classes.Question;
        this.uriPrefix = Constants.essayQuestionURI;
    }

    _fill(data) {
        super._fill(data);
    }
}
