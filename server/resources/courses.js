import Query from "../query/Query";

const { Client, Node, Text, Data, Triple } = require("virtuoso-sparql-client");
const ID = require("virtuoso-uid");
const express = require("express");
const router = express.Router();

const ontologyURI = "http://www.courses.matfyz.sk/ontology#";
const graphURI = "http://www.courses.matfyz.sk";
const resourceName = "courses";
const virtuosoEndpoint = "http://matfyz.sk:8890/sparql";

const db = new Client(virtuosoEndpoint);
db.addPrefixes({
  courses: ontologyURI
});
db.setQueryFormat("application/json");
db.setQueryGraph(graphURI);

router.get("/", async (req, res) => {
  const q = new Query();
  q.setProto({
    id: "?courseId",
    name: "$courses:name$required",
    about: "$courses:about$required",
    abbreviation: "$courses:abbreviation$required",
    hasPrerequisite: {
      id: "?prereqId"
    },
    mentions: {
      id: "?mentionsTopicId"
    },
    covers: {
      id: "?coversTopicId"
    }
  });
  q.setWhere([
    "?courseId a courses:Course",
    "OPTIONAL { ?courseId courses:hasPrerequisite ?prereqId }",
    "OPTIONAL { ?courseId courses:mentions ?mentionsTopicId }",
    "OPTIONAL { ?courseId courses:covers ?coversTopicId }"
  ]);
  q.setPrefixes({
    courses: "http://www.courses.matfyz.sk/ontology#"
  });
  res.status(200).send(await q.run());
});

router.post("/", (req, res) => {
  const newCourse = new Node(`${graphURI}/${resourceName}/${req.body.id}`);
  var triples = [
    new Triple(newCourse, "rdf:type", "courses:Course"),
    new Triple(newCourse, "courses:name", new Text(req.body.name)),
    new Triple(newCourse, "courses:about", new Text(req.body.about)),
    new Triple(
      newCourse,
      "courses:abbreviation",
      new Text(req.body.abbreviation)
    )
  ];
  if (req.body.hasPrerequisite != null) {
    for (var p of req.body.hasPrerequisite) {
      triples.push(
        new Triple(newCourse, "courses:hasPrerequisite", new Node(p))
      );
    }
  }
  if (req.body.mentions != null) {
    for (var p of req.body.mentions) {
      triples.push(new Triple(newCourse, "courses:mentions", p));
    }
  }
  if (req.body.covers != null) {
    for (var p of req.body.covers) {
      triples.push(new Triple(newCourse, "courses:covers", p));
    }
  }
  db.getLocalStore().bulk(triples);
  db.store(true)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err));
});

router.get("/:id", async (req, res) => {
  const resourceUri = `<${graphURI}/${resourceName}/${req.params.id}>`;
  const q = new Query();
  q.setProto({
    id: resourceUri,
    name: "$courses:name$required",
    about: "$courses:about$required",
    abbreviation: "$courses:abbreviation$required",
    hasPrerequisite: {
      id: "?prereqId"
    },
    mentions: {
      id: "?mentionsTopicId"
    },
    covers: {
      id: "?coversTopicId"
    }
  });
  q.setWhere([
    `${resourceUri} a courses:Course`,
    `OPTIONAL { ${resourceUri} courses:hasPrerequisite ?prereqId }`,
    `OPTIONAL { ${resourceUri} courses:mentions ?mentionsTopicId }`,
    `OPTIONAL { ${resourceUri} courses:covers ?coversTopicId }`
  ]);
  q.setPrefixes({ courses: "http://www.courses.matfyz.sk/ontology#" });
  const data = await q.run();
  if (JSON.stringify(data) == "{}") {
    res.status(404).send({});
  } else {
    res.status(200).send(data);
  }
});

router.get("/:id/instances", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
