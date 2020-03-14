import Resource from "../model/Resource";
import { userProfile } from "../model/agent/userProfile";
import { db } from "../config/client";
import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const axios = require("axios").default;
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
import Query from "../query/Query";

export function checkValidation(req, res, next) {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(200).json({ status: false, msg: "Fill required attributes!", user: null });
   }
   next();
}

export function emailIsFree(req, res, next) {
   console.log("checking if email is free");

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
         next();
      })
      .catch(err => {
         res.status(500).send(err);
      });
}

export async function createUser(req, res) {
   const user = new Resource(userProfile);

   const hash = bcrypt.hashSync(req.body.user.password, 10);
   try {
      await user.setPredicate(firstName.value, req.body.user.first_name);
      await user.setPredicate(lastName.value, req.body.user.last_name);
      await user.setPredicate(email.value, req.body.user.email);
      await user.setPredicate(password.value, hash);
      await user.setPredicate(useNickName.value, req.body.privacy.use_nickname);
      await user.setPredicate(publicProfile.value, req.body.privacy.public_profile);
      await user.setPredicate(showCourses.value, req.body.privacy.show_courses);
      await user.setPredicate(showBadges.value, req.body.privacy.show_badges);
      await user.setPredicate(allowContact.value, req.body.privacy.allow_contact);
      await user.setPredicate(description.value, req.body.user.description);
      await user.setPredicate(nickname.value, req.body.privacy.nickname);
   } catch (err) {
      console.log(err);
      return res.status(200).send({ status: false, msg: err, user: null });
   }

   user
      .store()
      .then(data => {
         let token = generateToken({ userURI: user.subject.iri, email: req.body.user.email });
         res.send({
            status: true,
            user: {
               name: req.body.privacy.use_nickname ? req.body.privacy.nickname : req.body.user.first_name + " " + req.body.user.last_name,
               type: "student",
               avatar: null
            },
            _token: token
         });
      })
      .catch(err => {
         console.log(err);
         return res.status(500).send({ status: false });
      });
}

function generateToken({ userURI, email }) {
   let token = jwt.sign({ userURI, email }, authSecret, {
      algorithm: "HS256"
   });
   return token;
}

export function login(req, res) {
   const query = new Query(userProfile);
   query.generateQuery({ email: req.body.email });
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
         res.send({
            status: true,
            user: {
               name: userData.useNickName ? userData.nickname : userData.firstName + " " + userData.lastName,
               type: "student",
               avatar: null
            },
            _token: generateToken({ userURI: userData["@id"], email: userData.email })
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).send({ status: false, msg: err });
      });
}

export function githubLogin(req, res) {
   const code = req.query.code;
   console.log("CODE", code);
   axios
      .post("https://github.com/login/oauth/access_token", {
         client_id: "f937b5e763fd295e11b9",
         client_secret: "b0cb4f40f0065a50f5ab671089de7208cf592614",
         code
      })
      .then(resp => {
         const access_token = resp.data.split("&")[0].split("=")[1];
         console.log("ACCESS TOKEN", access_token);
         return axios.get(`https://api.github.com/user?access_token=${access_token}`);
      })
      .then(resp => {
         const email = resp.email;
         console.log("USER EMAIL", email);
         if (!email) {
            return res.status(200).send({
               status: false,
               msg: "Empty email"
            });
         }
         const u = new Resource(user);
         const query = u.generateQuery({ email });
         return query.run();
      })
      .then(data => {
         if (data["@graph"].length == 0) {
            return res.status(200).send({
               status: false,
               msg: "Credentials not valid"
            });
         }
         const userData = data["@graph"][0];
         res.send({
            status: true,
            user: {
               name: userData.useNickName ? userData.nickname : userData.firstName + " " + userData.lastName,
               type: "student",
               avatar: null
            },
            _token: generateToken(userData)
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).send({ status: false, msg: err });
      });
}

export async function patchUser(req, res) {
   const user = new Resource(userProfile);
   user.setSubject(req.user.userURI);

   const data = await user.fetch();
   user.fill(data);

   for (var predicateName in req.body) {
      if (req.body.hasOwnProperty(predicateName)) {
         try {
            await user.setPredicate(predicateName, req.body[predicateName]);
         } catch (err) {
            return res.status(422).send({ status: false, msg: err });
         }
      }
   }

   user
      .patch()
      .then(data => res.status(200).send({ status: true }))
      .catch(err => res.status(500).send({ status: false, msg: err }));
}

export function deleteUser() {}
