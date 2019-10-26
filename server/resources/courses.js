import * as Constants from "../constants";
import { buildUri, getNewNode } from "../helpers";
import Query from "../query/Query";
import { Client, Node, Text, Data, Triple } from "virtuoso-sparql-client";
import express from "express";

const router = express.Router();

const db = new Client(Constants.virtuosoEndpoint);
db.addPrefixes({
  courses: Constants.ontologyURI
});
db.setQueryFormat("application/json");
db.setQueryGraph(Constants.graphURI);

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
  res.status(200).send(await q.run());
});

router.post("/", async (req, res) => {
  const newCourse = await getNewNode(Constants.coursesURI);
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
      triples.push(new Triple(newCourse, "courses:mentions", new Node(p)));
    }
  }
  if (req.body.covers != null) {
    for (var p of req.body.covers) {
      triples.push(new Triple(newCourse, "courses:covers", new Node(p)));
    }
  }
  db.getLocalStore().bulk(triples);
  db.store(true)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err));
});

router.post("/createInstance", async (req, res) => {
  var { courseId, year, instructors } = req.body;
  const courseURI = buildUri(Constants.coursesURI, courseId);
  const q = new Query();
  q.setProto({
    id: courseURI,
    name: "$courses:name$required"
  });
  q.setWhere([`${courseURI} a courses:Course`]);
  const data = await q.run();
  if (JSON.stringify(data) == "{}") {
    res.status(404).send({});
    return;
  }

  const newCourseInstance = await getNewNode(Constants.courseInstancesURI);

  var triples = [
    new Triple(newCourseInstance, "rdf:type", "courses:CourseInstance"),
    new Triple(newCourseInstance, "courses:year", new Text(year)),
    new Triple(newCourseInstance, "courses:instanceOf", courseURI)
  ];
  if (instructors) {
    for (var uri of instructors) {
      triples.push(new Triple(newCourseInstance, "courses:hasInstructor", new Node(uri)));
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
  if (courseId.length > 0) q.appendWhere(`?instanceId courses:instanceOf ${buildUri(Constants.coursesURI, courseId)}`);

  res.status(200).send(await q.run());
});

router.get("/:id", async (req, res) => {
  const resourceUri = buildUri(Constants.coursesURI, req.params.id);
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
  const data = await q.run();
  if (JSON.stringify(data) == "{}") {
    res.status(404).send({});
  } else {
    res.status(200).send(data);
  }
});

module.exports = router;
