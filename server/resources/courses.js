const { Client, Node, Text, Data, Triple } = require("virtuoso-sparql-client");
const ID = require("virtuoso-uid");
const sparqlTransformer = require("sparql-transformer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.sendStatus(200);
});

router.post("/", (req, res) => {
  res.sendStatus(200);
});

router.get("/:id", (req, res) => {
  res.sendStatus(200);
});

router.get("/:id/instances", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
