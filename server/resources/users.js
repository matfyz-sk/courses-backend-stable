import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { buildUri, getNewNode, validateRequestBody } from "../helpers";
import { createUserRequest } from "../constants/schemas";
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
        id: "?userId",
        name: "$courses:name",
        surname: "$courses:surname",
        email: "$courses:email",
        about: "$courses:about",
        nickname: "$courses:nickname"
    });
    q.setWhere([`?userId ${Predicates.type} courses:User`]);
    res.status(200).send(await q.run());
});

router.get("/:id", async (req, res) => {
    const resourceUri = buildUri(Constants.usersURI, req.params.id);
    const q = new Query();
    q.setProto({
        id: resourceUri,
        name: "$courses:name$required",
        surname: "$courses:surname$required",
        email: "$courses:email$required",
        about: "$courses:about$required",
        nickname: "$courses:nickname$required"
    });
    q.setWhere([`${resourceUri} ${Predicates.type} courses:User`]);
    const data = await q.run();
    if (JSON.stringify(data) == "{}") {
        res.status(404).send({});
    } else {
        res.status(200).send(data);
    }
});

router.post("/", async (req, res) => {
    const validationResult = validateRequestBody(req.body, createUserRequest);
    if (validationResult.length > 0) {
        res.status(400).json({
            errorType: "BAD_REQUEST",
            errorMessages: validationResult
        });
        return;
    }

    var newUser = await getNewNode(Constants.usersURI);
    var triples = [
        new Triple(newUser, Predicates.type, "courses:User"),
        new Triple(newUser, Predicates.name, new Text(req.body.name)),
        new Triple(newUser, Predicates.surname, new Text(req.body.surname)),
        new Triple(newUser, Predicates.email, new Text(req.body.email)),
        new Triple(newUser, Predicates.description, new Text(req.body.about)),
        new Triple(newUser, Predicates.nickname, new Text(req.body.nickname))
    ];
    db.setQueryGraph(Constants.graphURI);
    db.getLocalStore().bulk(triples);
    db.store(true)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
});

router.post("/:id/requestCourse/:courseId", (req, res) => {});

router.post("/:id/requestTeam/:teamId", (req, res) => {});

router.delete("/:id", async (req, res) => {});

exports.userRouter = router;
