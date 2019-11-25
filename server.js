import express from "express";
import bodyParser from "body-parser";
import router from "./routes";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/data", router);

app.listen(port, () => console.log(`Server running on port ${port}`));
