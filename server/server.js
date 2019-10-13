const path = require("path");
const express = require("express");
const layout = require("express-layout");
const bodyParser = require("body-parser");

const routes = require("./routes");
const app = express();
const port = 3001;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const middlewares = [
  layout(),
  express.static(path.join(__dirname, "public")),
  bodyParser.urlencoded()
];
app.use(middlewares);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", routes);

app.listen(port, () => console.log(`Server running on port ${port}`));
