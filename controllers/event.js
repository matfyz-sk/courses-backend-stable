import Query from "../query/Query";
import { Node, Text, Data, Triple } from "virtuoso-sparql-client";
import * as Constants from "../constants";
import * as Predicates from "../constants/predicates";
import * as Classes from "../constants/classes";
import * as Messages from "../constants/messages";
import { buildUri, getNewNode, predicate, prepareQueryUri, resourceExists, emptyResult } from "../helpers";
import Lecture from "../model/Event/Session/Lecture";
import Lab from "../model/Event/Session/Lab";
import CourseInstance from "../model/Event/CourseInstance";
import Block from "../model/Event/Block";

export function createLecture(req, res) {
    const lecture = new Lecture();
    lecture.room = req.body.room;
    lecture.hasInstructor = req.body.hasInstructor;
    lecture.startDate = req.body.startDate;
    lecture.endDate = req.body.endDate;
    lecture.store();
    res.send();
}

export function deleteLecture(req, res) {
    const lecture = new Lecture(buildUri(Constants.lectureURI, req.params.id));
    lecture.fetch();
    lecture.delete();
    res.send();
}

export function patchLecture(req, res) {
    const lecture = new Lecture(buildUri(Constants.lectureURI, req.params.id));
    lecture.fetch();
    if (req.body.room) lecture.room = req.body.room;
    lecture.patch();
    res.send();
}

export function createLab(req, res) {
    const lab = new Lab();
    lab.room = req.body.room;
    lab.hasInstructor = req.body.hasInstructor;
    lab.startDate = req.body.startDate;
    lab.endDate = req.body.endDate;
    lab.store();
    res.send();
}

export function deleteLab(req, res) {
    const lab = new Lab(buildUri(Constants.labURI, req.params.id));
    lab.fetch();
    lab.delete();
    res.send();
}

export function patchLab(req, res) {
    const lab = new Lab(buildUri(Constants.labURI, req.params.id));
    lab.fetch();
    if (req.body.room) lab.room = req.body.room;
    lab.patch();
    res.send();
}

export function createCourseInstance(req, res) {
    const courseInstance = new CourseInstance();
    courseInstance.instanceOf = req.body.instanceOf;
    courseInstance.startDate = req.body.startDate;
    courseInstance.endDate = req.body.endDate;
    courseInstance.hasInstructor = req.body.hasInstructor;
    courseInstance
        .store()
        .then(data => res.status(201).send(courseInstance.subject))
        .catch(err => res.status(500).send(err));
}

export function createBlock(req, res) {
    const block = new Block();
    block.name = req.body.name;
    block.location = req.body.location;
    block.description = req.body.description;
    block.startDate = req.body.startDate;
    block.endDate = req.body.endDate;
    block.uses = req.body.uses;
    block.recommends = req.body.recommends;
    block.covers = req.body.covers;
    block.mentions = req.body.mentions;
    block.requires = req.body.requires;
    block
        .store()
        .then(data => res.status(201).send(block.subject))
        .catch(err => res.status(500).send(err));
}

export function createAssignmentPeriod(req, res) {}

export function createOralExam(req, res) {}

export function createTestTake(req, res) {}

export function getAllCourseInstances(req, res) {
    const q = new Query();
    q.setProto({
        "@id": "?courseInstanceId",
        "@type": Classes.CourseInstance
    });
}
