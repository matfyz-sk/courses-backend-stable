import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import { buildUri, getNewNode } from "../helpers";
import Query from "../query/Query";
import { Client, Node, Text, Data, Triple } from "virtuoso-sparql-client";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const q = new Query();
    q.setProto({
        id: "?teamId",
        name: "$courses:name$required",
        course: {
            id: "?courseId"
        },
        members: {
            id: "?userId",
            name: "$courses:name$required",
            surname: "$courses:surname$required",
            email: "$courses:email$required"
        }
    });
    q.setWhere([
        `?teamId ${Predicates.type} courses:Team`,
        `?teamId ${Predicates.course} ?courseId`,
        `OPTIONAL { ?teamId ${Predicates.hasMember} ?userId }`
    ]);
    res.status(200).send(await q.run());
});

router.get("/:id", async (req, res) => {
    const resourceUri = buildUri(Constants.teamsURI, req.params.id);
    const q = new Query();
    q.setProto({
        id: resourceUri,
        name: "$courses:name$required",
        course: {
            id: "?courseId"
        },
        members: {
            id: "?userId",
            name: "$courses:name$required",
            surname: "$courses:surname$required",
            email: "$courses:email$required"
        }
    });
    q.setWhere([
        `${resourceUri} ${Predicates.type} courses:Team`,
        `${resourceUri} ${Predicates.course} ?courseId`,
        `${resourceUri} ${Predicates.hasMember} ?userId`
    ]);
    const data = await q.run();
    if (JSON.stringify(data) == "{}") {
        res.status(404).send({});
    } else {
        res.status(200).send(data);
    }
});

exports.teamsRouter = router;
