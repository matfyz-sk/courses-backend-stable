import * as Constants from "../constants";
import { buildUri, getNewNode, validateRequestBody } from "../helpers";
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

router.get("/questions", async (req, res) => {
    const q = new Query();
    q.setProto({
        id: "?id",
        title: "$courses:name",
        topic: "$courses:about"
    });
    q.setWhere(["?id rdf:type courses:Question", "?id courses:approvedAsPublic ?approvedAsPublicId", "?id courses:approvedAsPrivate ?approvedAsPrivateId"]);
    q.setFilter(["?approvedAsPublicId != <undefined> || ?approvedAsPrivateId != <undefined>"]);

    res.status(200).send(await q.run());
});

router.get("/questionVersions/:id", async (req, res) => {
    const questionURI = buildUri(Constants.questionURI, req.params.id);

    const q = new Query();
    q.setProto({
        id: questionUri,
        title: "$courses:name",
        approvedAsPublicId: "$courses:approvedAsPublic",
        approvedAsPrivateId: "$courses:approvedAsPrivate",
        topic: {
            id: "$courses:about",
            name: "$courses:name"
        },
        lastSeenByStudent: "$courses:lastSeenByStudent",
        lastSeenByTeacher: "$courses:lastSeenByTeacher",
        lastChange: "$courses:lastChange",
        questionVersions: {
            id: "$courses:version",
            text: "$courses:text",
            created: "$dcterms:created",
            questionType: "$rdf:type",
            answers: {
                id: "$courses:answer",
                text: "$courses:text",
                correct: "$courses:correct",
                position: "$courses:position"
            },
            comments: {
                id: "$courses:comment",
                author: {
                    id: "$courses:author",
                    name: "$courses:name"
                },
                date: "$dcterms:created",
                text: "$courses:text"
            }
        }
    });
    q.setWhere([`${questionUri} a courses:Question`]);
    q.setOrderBy(["DESC(?v82)", "?v852", "?v843"]);
    q.setPrefixes({
        courses: Constants.ontologyURI,
        dcterms: "http://purl.org/dc/terms/"
    });

    let data = await q.run();
    if (data && data.length && data.length > 0) {
        let questionVersions = toArray(data[0].questionVersions);
        questionVersions.forEach(questionVersion => {
            questionVersion.answers = toArray(questionVersion.answers);
            questionVersion.comments = toArray(questionVersion.comments);
        });

        data[0].questionVersions = questionVersions;
    }
    res.status(200).json(data[0]);
});

router.get("/questionTypes", async (req, res) => {
    const q = new Query();
    q.setProto({
        id: "?id",
        name: "$rdfs:label"
    });
    q.setWhere(["?id rdfs:subClassOf courses:QuestionVersion"]);
    res.status(200).send(await q.run());
});

router.post("/questions", async (req, res) => {
    const author = req.body.token;
    //TODO previest token na authora
    const title = req.body.title;
    const questionText = req.body.questionText;
    const topic = req.body.topic;
    const questionType = req.body.questionType;
    const answers = req.body.answers;

    let questionNode = await getNewNode(Constants.questionURI);
    var triples = [
        new Triple(questionNode, "rdf:type", "courses:Question"),
        new Triple(questionNode, "courses:author", new Node(author)),
        new Triple(questionNode, "rdfs:label", new Text(title)),
        new Triple(questionNode, "courses:about", new Node(topic)),
        new Triple(new Node(topic), "courses:questionsAboutMe", questionNode),
        new Triple(questionNode, "courses:approvedAsPublic", new Node()),
        new Triple(questionNode, "courses:approvedAsPrivate", new Node())
    ];

    let questionVersionNode = await getNewNode(Constants.questionVersionURI);

    triples.push(new Triple(questionVersionNode, "rdf:type", new Node(questionType)));
    triples.push(new Triple(questionVersionNode, "courses:text", new Text(questionText, "sk")));
    triples.push(new Triple(questionVersionNode, "courses:author", new Node(author)));
    triples.push(new Triple(questionVersionNode, "courses:ofQuestion", questionNode));
    triples.push(new Triple(questionNode, "courses:version", questionVersionNode));
    triples.push(new Triple(questionNode, "courses:lastChange", new Data(db.getLocalStore().now, "xsd:dateTimeStamp")));

    let time = new Date();
    time.setHours(time.getHours() - 4);
    triples.push(
        new Triple(questionNode, "courses:lastSeenByTeacher", new Data(isTeacher(author) ? db.getLocalStore().now : time.toISOString(), "xsd:dateTimeStamp"))
    );
    triples.push(
        new Triple(questionNode, "courses:lastSeenByStudent", new Data(!isTeacher(author) ? db.getLocalStore().now : time.toISOString(), "xsd:dateTimeStamp"))
    );

    console.log(triples);
    res.send(200);
});

function isTeacher(foo) {
    return true;
}

exports.quizRouter = router;
