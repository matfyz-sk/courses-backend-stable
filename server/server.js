const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const teams = require("./resources/teams");
const users = require("./resources/users");

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/teams", teams);
app.use("/users", users);

app.listen(port, () => console.log(`Server running on port ${port}`));
