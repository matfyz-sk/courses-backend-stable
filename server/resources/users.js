const { Client, Node, Text, Data, Triple } = require("virtuoso-sparql-client");
const ID = require("virtuoso-uid");
const sparqlTransformer = require("sparql-transformer");
const express = require("express");
const router = express.Router();

const ontologyURI = "http://www.courses.matfyz.sk/ontology#";
const graphURI = "http://www.courses.matfyz.sk";
const resourceName = "users";
const virtuosoEndpoint = "http://matfyz.sk:8890/sparql";

const db = new Client(virtuosoEndpoint);
db.addPrefixes({
  courses: ontologyURI
});
db.setQueryFormat("application/json");
db.setQueryGraph(graphURI);

const transformerOptions = {
  context: "http://schema.org",
  endpoint: virtuosoEndpoint,
  debug: true
};

router.get("/", async (req, res) => {
  var query = {
    "@context": {
      //User: "http://www.courses.matfyz.sk/ontology#User"
    },
    "@graph": [
      {
        "@id": "?userId",
        name: "?name",
        surname: "?surname",
        email: "?email",
        about: "?about",
        nickname: "?nickname"
      }
    ],
    $where: [
      "?userId a courses:User",
      "?userId courses:name ?name",
      "?userId courses:surname ?surname",
      "?userId courses:email ?email",
      "?userId courses:about ?about",
      "?userId courses:nickname ?nickname"
    ],
    $prefixes: {
      courses: "http://www.courses.matfyz.sk/ontology#"
    }
  };
  var out = {};
  await sparqlTransformer
    .default(query, transformerOptions)
    .then(res => (out = res));
  res.send(out);
});

router.post("/", async (req, res) => {
  //const data = req.body;
  var newUser = new Node(graphURI + "/" + resourceName + "/2000");
  var triples = [
    new Triple(newUser, "rdf:type", "courses:User"),
    new Triple(newUser, "courses:name", new Text(req.body.name)),
    new Triple(newUser, "courses:surname", new Text(req.body.surname)),
    new Triple(newUser, "courses:email", new Text(req.body.email)),
    new Triple(newUser, "courses:about", new Text(req.body.about)),
    new Triple(newUser, "courses:nickname", new Text(req.body.nickname))
  ];
  db.getLocalStore().bulk(triples);
  await db
    .store(true)
    .then(res => {
      console.log("Success");
      console.log(res);
    })
    .catch(err => {
      console.log("Error");
      console.log(err);
    });
  //var id = await getNewId();
  res.status(200).send(req.body);
});

router.post("/:id/requestCourse/:courseId", (req, res) => {});

router.post("/:id/requestTeam/:teamId", (req, res) => {});

router.delete("/:id", async (req, res) => {
  const userId = `http://www.courses.matfyz.sk/user/${req.params.id}`;
  res.status(200).send(req.params);
});

router.get("/:id", async (req, res) => {
  const resourceUri =
    "<" + graphURI + "/" + resourceName + "/" + req.params.id + ">";
  const query = {
    "@context": "http://schema.org",
    "@graph": [
      {
        "@type": "User",
        "@id": resourceUri,
        name: "$courses:name$required",
        surname: "$courses:surname$required",
        email: "$courses:email$required",
        about: "$courses:about$required",
        nickname: "$courses:nickname$required"
      }
    ],
    $where: [resourceUri + " a courses:User"],
    $prefixes: {
      courses: "http://www.courses.matfyz.sk/ontology#"
    }
  };
  const options = {
    context: "http://schema.org",
    endpoint: virtuosoEndpoint,
    debug: true
  };
  var out = {};
  await sparqlTransformer
    .default(query, options)
    .then(res => (out = res))
    .catch(err => {});
  console.log(out);
  res.send(out);
});

async function getNewId() {
  ID.config({
    endpoint: virtuosoEndpoint,
    graph: graphURI,
    prefix: graphURI + "/" + resourceName + "/"
  });
  var newID;
  await ID.create()
    .then(id => {
      newID = id;
    })
    .catch(console.log);
  return newID;
}

module.exports = router;
