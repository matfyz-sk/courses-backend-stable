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
    new Triple(newCourse, "courses:abbreviation", new Text(req.body.abbreviation))
  ];
  if (req.body.hasPrerequisite != null) {
    for (var p of req.body.hasPrerequisite) {
      triples.push(new Triple(newCourse, "courses:hasPrerequisite", new Node(p)));
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

function getUri(resourceName, id, f = true) {
  return `${f ? "<" : ""}${graphURI}/${resourceName}/${id}${f ? ">" : ""}`;
}

router.post("/createInstance", async (req, res) => {
  var { courseId, year, instructors } = req.body;

  const q = new Query();
  q.setProto({
    id: getUri("courses", courseId),
    name: "$courses:name$required"
  });
  q.setWhere([`${getUri("courses", courseId)} a courses:Course`]);
  q.setPrefixes({ courses: ontologyURI });
  const data = await q.run();
  if (JSON.stringify(data) == "{}") {
    res.status(404).send({});
    return;
  }

  const courseInstanceNode = await getNewNode("courseInstance");

  var triples = [
    new Triple(courseInstanceNode, "rdf:type", "courses:CourseInstance"),
    new Triple(courseInstanceNode, "courses:year", new Text(year)),
    new Triple(courseInstanceNode, "courses:instanceOf", new Node(getUri("courses", courseId, false)))
  ];

  if (instructors) {
    for (var uri of instructors) {
      triples.push(new Triple(courseInstanceNode, "courses:hasInstructor", new Node(uri)));
    }
  }

  db.getLocalStore().bulk(triples);

  db.store(true)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err));
});

router.get("/instances", async (req, res) => {
  const year = req.query.year != null && req.query.year.length > 0 ? req.query.year : "";
  const courseId = req.query.courseId != null && req.query.courseId.length > 0 ? req.query.courseId : "";

  console.log(year, courseId);

  const q = new Query();
  q.setProto({
    id: "?instanceId",
    year: "$courses:year$required",
    instanceOf: "$courses:instanceOf$required",
    instructors: {
      id: "?insId"
    }
  });
  q.setWhere(["?instanceId a courses:CourseInstance", "OPTIONAL { ?instanceId courses:hasInstructor ?insId }"]);
  if (year.length > 0) q.appendWhere(`?instanceId courses:year "${year}"`);
  if (courseId.length > 0) q.appendWhere(`?instanceId courses:instanceOf ${getUri("courses", courseId)}`);
  q.setPrefixes({
    courses: "http://www.courses.matfyz.sk/ontology#"
  });
  res.status(200).send(await q.run());
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

async function getNewNode(resourceName) {
  ID.config({
    endpoint: virtuosoEndpoint,
    graph: graphURI,
    prefix: graphURI + "/" + resourceName + "/"
  });
  let newNode;
  await ID.create()
    .then(commentIdTmp => {
      newNode = new Node(commentIdTmp);
    })
    .catch(console.log);
  return newNode;
}

module.exports = router;
