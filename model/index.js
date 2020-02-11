import { user } from "./Agent/User";
import { team } from "./Agent/Team";
import { essayQuestion } from "./Question/EssayQuestion";
import { openQuestion } from "./Question/OpenQuestion";
import { questionWithPredefinedAnswer } from "./Question/QuestionWithPredefinedAnswer";
import { directAnswer } from "./UserAnswer/DirectAnswer";
import { orderedAnswer } from "./UserAnswer/OrderedAnswer";
import { orderedQuestion } from "./OrderedQuestion";
import { predefinedAnswer } from "./PredefinedAnswer";
import { questionComment } from "./QuestionComment";
import { quizTake } from "./QuizTake";
import { quizTakePrototype } from "./QuizTakePrototype";

module.exports = {
    user,
    team,
    essayQuestion,
    openQuestion,
    questionWithPredefinedAnswer,
    directAnswer,
    orderedAnswer,
    orderedQuestion,
    predefinedAnswer,
    questionComment,
    quizTake,
    quizTakePrototype
};
