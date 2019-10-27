import { userRouter } from "./users";
import { coursesRouter } from "./courses";
import { teamsRouter } from "./teams";

module.exports = {
    users: userRouter,
    courses: coursesRouter,
    teams: teamsRouter
};
