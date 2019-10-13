const sparqlTransformer = require("sparql-transformer");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { Client } = require("virtuoso-sparql-client");

const JSONLD_QUERIES = "./json-ld-queries/";

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/local", (req, res) => {
  const graphName = req.body.graphName;
  const query = req.body.query;
  const format = req.body.format;
  localClient = new Client("http://matfyz.sk:8890/sparql");
  //localClient = new Client('http://localhost:8890/sparql');
  localClient.setQueryFormat(format);
  localClient.setQueryGraph(graphName);

  localClient
    .query(query)
    .then(results => {
      res.render("results", {
        results: results,
        format: format
      });
    })
    .catch(err => {
      console.log(err);
      res.send("Error!");
    });
});

router.get("/transformer", (req, res) => {
  var queries = fs.readdirSync(JSONLD_QUERIES);
  res.render("transformer", { files: queries });
});

router.post("/transformer-run", async (req, res) => {
  const options = {
    context: "http://schema.org",
    endpoint: "http://matfyz.sk:8890/sparql",
    //endpoint: "http://dbpedia.org/sparql",
    //endpoint: "http://127.0.0.1:8890/sparql",
    debug: true
  };
  const fileName = req.body.queryFile;
  const q = JSON.parse(
    fs.readFileSync(`${JSONLD_QUERIES}/${fileName}`, "utf8")
  );
  const out = await sparqlTransformer.default(q, options);
  res.render("results", {
    results: out,
    format: "application/json"
  });
});

router.get("/teams", async (req, res, next) => {
  const options = {
    context: "http://schema.org",
    endpoint: "http://matfyz.sk:8890/sparql",
    debug: true
  };
  console.log("Request: ", req.query.data);
  const q = JSON.parse(req.query.data);
  const out = await sparqlTransformer.default(q, options);
  res.send(out);
});

module.exports = router;
