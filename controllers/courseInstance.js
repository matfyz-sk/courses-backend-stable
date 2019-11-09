import { body, param, validationResult } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import { buildUri, getNewNode, predicate } from "../helpers";
import { db } from "../config/client";

export async function createCourseInstance(req, res) {
    var { courseId, year, instructors } = req.body;
    const courseURI = buildUri(Constants.coursesURI, courseId);
    const q = new Query();
    q.setProto({
        id: courseURI,
        name: "$courses:name$required"
    });
    q.setWhere([`${courseURI} ${Predicates.type} courses:Course`]);
    const data = await q.run();
    if (JSON.stringify(data) == "{}") {
        res.status(404).send({});
        return;
    }

    const newCourseInstance = await getNewNode(Constants.courseInstancesURI);

    var triples = [
        new Triple(newCourseInstance, Predicates.type, "courses:CourseInstance"),
        new Triple(newCourseInstance, Predicates.year, new Text(year)),
        new Triple(newCourseInstance, Predicates.instanceOf, courseURI)
    ];
    if (instructors) {
        for (var uri of instructors) {
            triples.push(new Triple(newCourseInstance, Predicates.hasInstructor, new Node(uri)));
        }
    }
    db.getLocalStore().bulk(triples);

    db.store(true)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).json(err));
}

export async function getCourseInstance(req, res) {
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
    q.setWhere([`?instanceId ${Predicates.type} courses:CourseInstance`, `OPTIONAL { ?instanceId ${Predicates.hasInstructor} ?insId }`]);

    if (year.length > 0) q.appendWhere(`?instanceId ${Predicates.year} "${year}"`);
    if (courseId.length > 0) q.appendWhere(`?instanceId ${Predicates.instanceOf} ${buildUri(Constants.coursesURI, courseId)}`);

    res.status(200).send(await q.run());
}
