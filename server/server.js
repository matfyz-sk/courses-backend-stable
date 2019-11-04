import express from "express";
import bodyParser from "body-parser";
import resources from "./resources";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/team", resources.team);
app.use("/api/user", resources.user);
app.use("/api/course", resources.course);
app.use("/api/quiz", resources.quiz);
app.use("/api/topic", resources.topic);

app.listen(port, () => console.log(`Server running on port ${port}`));
