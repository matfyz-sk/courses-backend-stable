import { agent } from "./agent/agent";
import { user } from "./agent/user";
import { team } from "./agent/team";
import { question } from "./question/question";
import { essayQuestion } from "./question/essayQuestion";
import { openQuestion } from "./question/openQuestion";
import { questionWithPredefinedAnswer } from "./question/questionWithPredefinedAnswer";
import { userAnswer } from "./userAnswer/userAnswer";
import { directAnswer } from "./userAnswer/directAnswer";
import { orderedAnswer } from "./userAnswer/orderedAnswer";
import { orderedQuestion } from "./orderedQuestion";
import { predefinedAnswer } from "./predefinedAnswer";
import { questionComment } from "./QuestionComment";
import { quizTake } from "./quizTake/quizTake";
import { quizTakePrototype } from "./quizTake/quizTakePrototype";
import { topic } from "./topic";
import { event } from "./event/event";
import { lecture } from "./event/session/lecture";
import { lab } from "./event/session/lab";
import { session } from "./event/session/session";
import { block } from "./event/block";
import { courseInstance } from "./event/courseInstance";
import { assignment } from "./task/assignment";
import { codeComment } from "./comment/codeComment";
import { codeReview } from "./CodeReview";
import { course } from "./course";
import { field } from "./field";
import { fieldType } from "./fieldType";
import { generatedQuizAssignment } from "./task/quizAssignment/generatedQuizAssignment";
import { manualQuizAssignment } from "./task/quizAssignment/manualQuizAssignment";
import { material } from "./material";
import { questionAssignment } from "./task/questionAssignment";
import { quizAssignment } from "./task/quizAssignment/quizAssignment";
import { review } from "./review";
import { studentReview } from "./StudentReview";
import { submission } from "./submission";
import { subbmittedField } from "./submittedField";
import { teamReview } from "./teamReview";
import { topicAppearance } from "./topicAppearance";
import { toReview } from "./ToReview";
import { task } from "./task/task";
import { taskEvent } from "./event/taskEvent/taskEvent";
import { assignmentPeriod } from "./event/taskEvent/assignmentPeriod";
import { comment } from "./comment/comment";

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
   toReview,
   task,
   taskEvent,
   assignmentPeriod,
   comment
};
