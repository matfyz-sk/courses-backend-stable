import * as Topic from "./topic";
// import * as Session from "./session";
import * as Course from "./course";
import * as CourseInstance from "./courseInstance";
import * as Event from "./event";
import * as Task from "./task";
import * as Agent from "./agent";
import * as ReviewComment from "./reviewComment";
import * as Submission from "./submission";
import * as Quiz from "./quiz";
import * as PostController from "./post";
import * as GetController from "./get";
import * as DeleteController from "./delete";

module.exports = {
    PostController,
    GetController,
    DeleteController,
    Quiz,
    Topic,
    // Session,
    Event,
    Course,
    CourseInstance,
    Task,
    Agent,
    ReviewComment,
    Submission
};
