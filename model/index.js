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
import { assignment } from "./Assignment";
import { codeComment } from "./CodeComment";
import { codeReview } from "./CodeReview";
import { course } from "./Course";
import { field } from "./Field";
import { fieldType } from "./FieldType";
import { generalComment } from "./GeneralComment";
import { generatedQuizAssignment } from "./GeneratedQuizAssignment";
import { manualQuizAssignment } from "./ManualQuizAssignment";
import { material } from "./Material";
import { questionAssignment } from "./QuestionAssignment";
import { quizAssignment } from "./QuizAssignment";
import { review } from "./Review";
import { studentReview } from "./StudentReview";
import { submission } from "./Submission";
import { subbmittedField } from "./SubmittedField";
import { teamReview } from "./TeamReview";
import { topicAppearance } from "./TopicAppearance";
import { toReview } from "./ToReview";

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
    courseInstance,
    assignment,
    codeComment,
    codeReview,
    course,
    field,
    fieldType,
    generalComment,
    generatedQuizAssignment,
    manualQuizAssignment,
    material,
    questionAssignment,
    quizAssignment,
    review,
    studentReview,
    submission,
    subbmittedField,
    teamReview,
    topicAppearance,
    toReview
};