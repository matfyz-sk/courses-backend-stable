import express from "express";
import bodyParser from "body-parser";
import resources from "./resources";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/teams", resources.teams);
app.use("/api/users", resources.users);
app.use("/api/courses", resources.courses);
app.use("/api/quizzes", resources.quizzes);

app.listen(port, () => console.log(`Server running on port ${port}`));
