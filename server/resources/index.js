import { userRouter } from "./users";
import { coursesRouter } from "./courses";
import { teamsRouter } from "./teams";
import { quizRouter } from "./quizzes";

module.exports = {
    users: userRouter,
    courses: coursesRouter,
    teams: teamsRouter,
    quizzes: quizRouter,
};
