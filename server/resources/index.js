import { userRouter } from "./users";
import { coursesRouter } from "./courses";
import { teamsRouter } from "./teams";
import { quizRouter } from "./quizzes";
import { topicsRouter } from "./topics";

module.exports = {
    users: userRouter,
    courses: coursesRouter,
    teams: teamsRouter,
    quizzes: quizRouter,
    topics: topicsRouter,
};
