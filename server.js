import express from "express";
import bodyParser from "body-parser";
import dataRouter from "./routes/data";
import actionsRouter from "./routes/actions";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/data", dataRouter);
// app.use("/action", actionsRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
