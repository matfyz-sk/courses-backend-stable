import { body, param } from "express-validator";
import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import { db } from "../config/client";

export async function createLecture(req, res) {
    var lectureNode = await getNewNode(Constants.lectureURI);
    var triples = [
        new Triple(lectureNode, Predicates.type, Classes.Lecture),
        new Triple(lectureNode, Predicates.subclassOf, Classes.Session)
    ];
    createSession(req, res, lectureNode, triples);
}

export async function createLab(req, res) {
    var labNode = await getNewNode(Constants.labURI);
    var triples = [new Triple(labNode, Predicates.type, Classes.Lab), new Triple(labNode, Predicates.subclassOf, Classes.Session)];
    createSession(req, res, labNode, triples);
}

export async function createCourseInstance(req, res) {
    const newCourseInstance = await getNewNode(Constants.courseInstancesURI);
    var triples = [
        new Triple(newCourseInstance, Predicates.type, Classes.CourseInstance),
        new Triple(newCourseInstance, Predicates.subclassOf, Classes.Event),
        new Triple(newCourseInstance, Predicates.year, new Text(req.body.year)),
        new Triple(newCourseInstance, Predicates.instanceOf, new Node(req.body.instanceOf))
    ];
    for (var userURI of req.body.hasInstructor) {
        triples.push(new Triple(newCourseInstance, Predicates.hasInstructor, new Node(userURI)));
    }
    createEvent(req, res, newCourseInstance, triples);
}

export async function createBlock(req, res) {
    const newBlock = await getNewNode(Constants.blockURI);
    var triples = [new Triple(newBlock, Predicates.type, Classes.Block), new Triple(newBlock, Predicates.subclassOf, Classes.Event)];
    createEvent(req, res, newBlock, triples);
}

export async function createOralExam(req, res) {
    var newOralExam = await getNewNode(Constants.oralExamURI);
    var triples = [
        new Triple(newOralExam, Predicates.type, Classes.OralExam),
        new Triple(newOralExam, Predicates.subclassOf, Classes.ExaminationEvent)
    ];
    createExaminationEvent(req, res, newOralExam, triples);
}

export async function createTestTake(req, res) {
    var newTestTake = await getNewNode(Constants.testTakeURI);
    var triples = [
        new Triple(newTestTake, Predicates.type, Classes.TestTake),
        new Triple(newTestTake, Predicates.subclassOf, Classes.ExaminationEvent)
    ];
    createExaminationEvent(req, res, newTestTake, triples);
}

export async function createAssignmentPeriod(req, res) {
    var newAssignmentPeriod = await getNewNode(Constants.assignmentPeriodURI);
    var triples = [
        new Triple(newAssignmentPeriod, Predicates.type, Classes.AssignmentPeriod),
        new Triple(newAssignmentPeriod, Predicates.subclassOf, Classes.TaskEvent)
    ];
    createTaskEvent(req, res, newAssignmentPeriod, triples);
}

async function createSession(req, res, subject, triples) {
    triples.push();
    createEvent(req, res, subject, triples);
}

async function createExaminationEvent(req, res, subject, triples) {
    triples.push();
    createTaskEvent(req, res, subject, triples);
}

async function createTaskEvent(req, res, subject, triples) {
    triples.push(new Triple(subject, Predicates.extraTime, req.body.extraTime), new Triple(subject, Predicates.task, req.body.task));
    createEvent(req, res, subject, triples);
}

async function createEvent(req, res, subject, triples) {
    if (req.body.covers) {
        for (topicURI of req.body.covers) triples.push(new Triple(subject, Predicates.covers, new Node(topicURI)));
    }
    if (req.body.mentions) {
        for (topicURI of req.body.mentions) triples.push(new Triple(subject, Predicates.mentions, new Node(topicURI)));
    }
    if (req.body.requires) {
        for (topicURI of req.body.requires) triples.push(new Triple(subject, Predicates.requires, new Node(topicURI)));
    }
    if (req.body.uses) {
        for (materialURI of req.body.uses) triples.push(new Triple(subject, Predicates.uses, new Node(materialURI)));
    }
    if (req.body.recommends) {
        for (materialURI of req.body.recommends) triples.push(new Triple(subject, Predicates.recommends, new Node(materialURI)));
    }
    if (req.body.subEvent) {
        triples.push(new Triple(subject, Predicates.subEvent, new Node(req.body.subEvent)));
        triples.push(new Triple(new Node(req.body.subEvent), Predicates.superEvent, subject));
    }
    if (req.body.superEvent) {
        triples.push(new Triple(subject, Predicates.superEvent, new Node(req.body.superEvent)));
        triples.push(new Triple(new Node(req.body.superEvent), Predicates.subEvent, subject));
    }
    triples.push(
        new Triple(subject, Predicates.startDate, new Text(req.body.startDate)),
        new Triple(subject, Predicates.endDate, new Text(req.body.endDate))
    );
    console.log("triples:", triples);
    res.status(200).send();
}

export function getAllCourseInstances(req, res) {
    const q = new Query();
    q.setProto({
        "@id": "?courseInstanceId",
        "@type": Classes.CourseInstance
    });
}
