import { agent } from "./Agent/Agent";
import { user } from "./Agent/User";
import { team } from "./Agent/Team";
import { question } from "./Question/Question";
import { essayQuestion } from "./Question/EssayQuestion";
import { openQuestion } from "./Question/OpenQuestion";
import { questionWithPredefinedAnswer } from "./Question/QuestionWithPredefinedAnswer";
import { userAnswer } from "./UserAnswer/UserAnswer";
import { directAnswer } from "./UserAnswer/DirectAnswer";
import { orderedAnswer } from "./UserAnswer/OrderedAnswer";
import { orderedQuestion } from "./OrderedQuestion";
import { predefinedAnswer } from "./PredefinedAnswer";
import { questionComment } from "./QuestionComment";
import { quizTake } from "./QuizTake";
import { quizTakePrototype } from "./QuizTakePrototype";
import { topic } from "./Topic";
import { event } from "./Event/Event";
import { lecture } from "./Event/Session/Lecture";
import { lab } from "./Event/Session/Lab";
import { session } from "./Event/Session/Session";
import { block } from "./Event/Block";
import { courseInstance } from "./Event/CourseInstance";

module.exports = {
    agent,
    user,
    team,
    question,
    essayQuestion,
    openQuestion,
    questionWithPredefinedAnswer,
    userAnswer,
    directAnswer,
    orderedAnswer,
    orderedQuestion,
    predefinedAnswer,
    questionComment,
    quizTake,
    quizTakePrototype,
    topic,
    event,
    lecture,
    lab,
    session,
    block,
    courseInstance
};
