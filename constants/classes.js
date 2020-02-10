import * as Prefixes from "./prefixes";
import * as URIPrefixes from "./index";

export const Thing = "courses:Thing";
export const Agent = { prefix: Prefixes.courses, value: "Agent", uriPrefix: URIPrefixes.agentURI };
export const User = { prefix: Prefixes.courses, value: "User", uriPrefix: URIPrefixes.usersURI };
export const Team = { prefix: Prefixes.courses, value: "Team", uriPrefix: URIPrefixes.teamsURI };
export const Course = "courses:Course";
export const CourseInstance = "courses:CourseInstance";
export const Event = "courses:Event";
export const Session = "courses:Session";
export const Lecture = "courses:Lecture";
export const Lab = "courses:Lab";
export const Topic = "courses:Topic";
export const QuestionVersion = "courses:QuestionVersion";
export const Assignment = "courses:Assignment";
export const QuizAssignment = "courses:QuizAssignment";
export const QuestionAssignment = "courses:QuestionAssignment";
export const Task = "courses:Task";
export const Block = "courses:Block";
export const OralExam = "courses:OralExam";
export const TestTake = "courses:TestTake";
export const ExaminationEvent = "courses:ExaminationEvent";
export const AssignmentPeriod = "courses:AssignmentPeriod";
export const CodeComment = "courses:CodeComment";
export const GeneralComment = "courses:GeneralComment";
export const SubmittedField = "courses:SubmittedField";
export const Review = "courses:Review";
export const CodeReview = "courses:CodeReview";
export const TeamReview = "courses:TeamReview";
export const Submission = "courses:Submission";
export const Comment = "courses:Comment";
export const Question = "courses:Question";
export const OrderedQuestion = "courses:OrderedQuestion";
export const UserAnswer = "courses:UserAnswer";
export const PredefinedAnswer = "courses:PredefinedAnswer";
export const QuizTake = "courses:QuizTake";
export const QuizTakePrototype = "courses:QuizTakePrototype";
export const QuestionComment = "courses:QuestionComment";
export const EssayQuestion = "courses:EssayQuestion";
export const DirectAnswer = "courses:DirectAnswer";
export const OrderedAnswer = "courses:OrderedAnswer";
export const OpenQuestion = { prefix: Prefixes.courses, value: "OpenQuestion", uriPrefix: URIPrefixes.openQuestionURI };
export const QuestionWithPreddefinedAnswer = {
    prefix: Prefixes.courses,
    value: "QuestionWithPreddefinedAnswer",
    uriPrefix: URIPrefixes.questionWithPreddefinedAnswerURI
};
