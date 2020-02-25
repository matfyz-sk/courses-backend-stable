import express from "express";
import Resource from "../model/Resource";
import { user } from "../model";
import {
    firstName,
    lastName,
    email,
    password,
    useNickName,
    publicProfile,
    showBadges,
    showCourses,
    allowContact,
    description,
    nickname
} from "../constants/predicates";
import { authSecret } from "../constants";
import { db } from "../config/client";
import { body, validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRouter = express.Router();

authRouter.post(
    "/register",
    [
        body("user").exists(),
        body("user.first_name")
            .exists()
            .isString(),
        body("user.last_name")
            .exists()
            .isString(),
        body("user.email")
            .exists()
            .isEmail(),
        body("user.password")
            .exists()
            .isString(),
        body("privacy").exists(),
        body("privacy.use_nickname")
            .exists()
            .isBoolean(),
        body("privacy.public_profile")
            .exists()
            .isBoolean(),
        body("privacy.show_courses")
            .exists()
            .isBoolean(),
        body("privacy.show_badges")
            .exists()
            .isBoolean(),
        body("privacy.allow_contact")
            .exists()
            .isBoolean(),
        body("privacy.nickname")
            .if(body("privacy.use_nickname").custom(value => value === true))
            .exists()
            .isString()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ status: false, msg: "Fill required attributes!", user: null });
        }
        const u = new Resource(user);
        db.setQueryFormat("application/json");
        db.setQueryGraph("http://www.courses.matfyz.sk/data");
        db.query(
            `SELECT ?userURI
    WHERE {
      ?userURI rdf:type courses:User .
      ?userURI courses:email "${req.body.user.email}"
    }`,
            true
        )
            .then(data => {
                if (data.results.bindings.length != 0) {
                    return res.status(200).send({ status: false, msg: "Email is already registered!", user: null });
                }
                const hash = bcrypt.hashSync(req.body.user.password, 10);
                u.setPredicate(firstName.value, req.body.user.first_name);
                u.setPredicate(lastName.value, req.body.user.last_name);
                u.setPredicate(email.value, req.body.user.email);
                u.setPredicate(password.value, hash);
                u.setPredicate(useNickName.value, req.body.privacy.use_nickname);
                u.setPredicate(publicProfile.value, req.body.privacy.public_profile);
                u.setPredicate(showCourses.value, req.body.privacy.show_courses);
                u.setPredicate(showBadges.value, req.body.privacy.show_badges);
                u.setPredicate(allowContact.value, req.body.privacy.allow_contact);
                if (req.body.user.hasOwnProperty(description.value)) u.setPredicate(description.value, req.body.user.description);
                if (req.body.privacy.hasOwnProperty(nickname.value)) u.setPredicate(nickname.value, req.body.privacy.nickname);
                u.store().then(data => {
                    let token = jwt.sign({ userID: u.subject.iri }, authSecret, { algorithm: "HS256" });
                    res.send({
                        status: true,
                        user: {
                            name: req.body.privacy.use_nickname
                                ? req.body.privacy.nickname
                                : req.body.user.first_name + " " + req.body.user.last_name,
                            type: "student",
                            avatar: null
                        },
                        _token: token
                    });
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    }
);

authRouter.post("/login", [body("email").exists(), body("password").exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array() });
    }
    const u = new Resource(user);
    const query = u.generateQuery({ email: req.body.email });
    query
        .run()
        .then(data => {
            if (data["@graph"].length == 0) {
                return res.status(200).send({
                    status: false,
                    msg: "Credentials not valid"
                });
            }
            const userData = data["@graph"][0];
            if (!bcrypt.compareSync(req.body.password, userData.password)) {
                return res.status(200).send({
                    status: false,
                    msg: "Credentials not valid"
                });
            }
            const splittedURI = userData["@id"].split("/");
            const userID = splittedURI[splittedURI.length - 1];
            let token = jwt.sign({ userID: userID, useNickname: userData.useNickName }, authSecret, { algorithm: "HS256" });
            res.send({
                status: true,
                user: {
                    name: userData.useNickName ? userData.nickname : userData.firstName + " " + userData.lastName,
                    type: "student",
                    avatar: null
                },
                _token: token
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

export default authRouter;
