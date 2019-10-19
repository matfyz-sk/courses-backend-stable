const sparqlTransformer = require("sparql-transformer");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { Client } = require("virtuoso-sparql-client");

router.post("/local", (req, res) => {
  const graphName = req.body.graphName;
  const query = req.body.query;
  const format = req.body.format;
  localClient = new Client("http://matfyz.sk:8890/sparql");
  localClient.setQueryFormat(format);
  localClient.setQueryGraph(graphName);
  localClient
    .query(query)
    .then(results => {
      res.send(results);
    })
    .catch(err => {
      res.send("Error!");
    });
});

router.get("/", async (req, res, next) => {
  var query = {
    "@context": {
      User: "http://www.courses.matfyz.sk/ontology#User"
    },
    "@graph": [
      {
        "@id": "?teamId",
        name: "?name",
        course: {
          "@id": "?courseId"
        },
        members: {
          "@id": "?userId",
          name: "?userName",
          surname: "?surName",
          email: "?email"
        }
      }
    ],
    $where: [
      "?teamId a courses:Team",
      "?teamId courses:name ?name",
      "?teamId courses:course ?courseId",
      "?teamId courses:hasMember ?userId",
      "?userId courses:name ?userName",
      "?userId courses:surname ?surName",
      "?userId courses:email ?email"
    ],
    $prefixes: {
      courses: "http://www.courses.matfyz.sk/ontology#"
    }
  };

  const options = {
    context: "http://schema.org",
    endpoint: "http://matfyz.sk:8890/sparql",
    debug: true
  };

  const out = await sparqlTransformer.default(query, options);
  res.send(out);
});

router.get("/:id", async (req, res) => {
  const teamId = `<http://www.courses.matfyz.sk/team/${req.params.id}>`;

  var query = {
    "@context": {
      User: "http://www.courses.matfyz.sk/ontology#User"
    },
    "@graph": [
      {
        "@id": teamId,
        name: "?name",
        course: {
          "@id": "?courseId"
        },
        members: {
          "@id": "?userId",
          name: "?userName",
          surname: "?surName",
          email: "?email"
        }
      }
    ],
    $where: [
      teamId + " a courses:Team",
      teamId + " courses:name ?name",
      teamId + " courses:course ?courseId",
      teamId + " courses:hasMember ?userId",
      "?userId courses:name ?userName",
      "?userId courses:surname ?surName",
      "?userId courses:email ?email"
    ],
    $prefixes: {
      courses: "http://www.courses.matfyz.sk/ontology#"
    }
  };
  const options = {
    context: "http://schema.org",
    endpoint: "http://matfyz.sk:8890/sparql",
    debug: true
  };

  const out = await sparqlTransformer.default(query, options);
  res.send(out);
});

module.exports = router;
