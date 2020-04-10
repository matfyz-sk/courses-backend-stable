import Resource from "../resource";
import { userProfile } from "../model/agent/userProfile";
import { body, validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const axios = require("axios").default;
import { authSecret } from "../constants";
import runQuery from "../query";

export function checkValidation(req, res, next) {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(200).json({ status: false, msg: "Fill required attributes!", user: null });
   }
   next();
}

export function emailIsFree(req, res, next) {
   const data = runQuery(userProfile, { email: req.body.user.email });

   if (data["@graph"].length != 0) {
      return res
         .status(200)
         .send({ status: false, msg: "Email is already registered!", user: null });
   }
   next();

   // .catch(err => {
   //    res.status(500).send(err);
   // });
}

export async function createUser(req, res) {
   const user = new Resource(userProfile);
   const hash = bcrypt.hashSync(req.body.user.password, 10);
   try {
      await user.setPredicate("firstName", req.body.user.first_name);
      await user.setPredicate("lastName", req.body.user.last_name);
      await user.setPredicate("email", req.body.user.email);
      await user.setPredicate("password", hash);
      await user.setPredicate("useNickName", req.body.privacy.use_nickname);
      await user.setPredicate("publicProfile", req.body.privacy.public_profile);
      await user.setPredicate("showCourses", req.body.privacy.show_courses);
      await user.setPredicate("showBadges", req.body.privacy.show_badges);
      await user.setPredicate("allowContact", req.body.privacy.allow_contact);
      await user.setPredicate("description", req.body.user.description);
      await user.setPredicate("nickname", req.body.privacy.nickname);
   } catch (err) {
      console.log(err);
      return res.status(200).send({ status: false, msg: err, user: null });
   }

   user
      .store()
      .then((data) => {
         let token = generateToken({ userURI: user.subject.iri, email: req.body.user.email });
         res.send({
            status: true,
            user: {
               name: req.body.privacy.use_nickname
                  ? req.body.privacy.nickname
                  : req.body.user.first_name + " " + req.body.user.last_name,
               type: "student",
               avatar: null,
            },
            _token: token,
         });
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).send({ status: false });
      });
}

function generateToken({ userURI, email }) {
   let token = jwt.sign({ userURI, email }, authSecret, {
      algorithm: "HS256",
   });
   return token;
}

export function login(req, res) {
   runQuery(userProfile, { email: req.body.email })
      .then((data) => {
         if (data["@graph"].length == 0) {
            return res.status(200).send({
               status: false,
               msg: "Credentials not valid",
            });
         }
         const userData = data["@graph"][0];
         if (!bcrypt.compareSync(req.body.password, userData.password)) {
            return res.status(200).send({
               status: false,
               msg: "Credentials not valid",
            });
         }
         res.send({
            status: true,
            user: {
               name: userData.useNickName
                  ? userData.nickname
                  : userData.firstName + " " + userData.lastName,
               type: "student",
               avatar: null,
            },
            _token: generateToken({ userURI: userData["@id"], email: userData.email }),
         });
      })
      .catch((err) => {
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
         code,
      })
      .then((resp) => {
         const access_token = resp.data.split("&")[0].split("=")[1];
         console.log("ACCESS TOKEN", access_token);
         return axios.get(`https://api.github.com/user?access_token=${access_token}`);
      })
      .then((resp) => {
         const email = resp.email;
         console.log("USER EMAIL", email);
         if (!email) {
            return res.status(200).send({
               status: false,
               msg: "Empty email",
            });
         }
         return runQuery(userProfile, { email });
      })
      .then((data) => {
         if (data["@graph"].length == 0) {
            return res.status(200).send({
               status: false,
               msg: "Credentials not valid",
            });
         }
         const userData = data["@graph"][0];
         res.send({
            status: true,
            user: {
               name: userData.useNickName
                  ? userData.nickname
                  : userData.firstName + " " + userData.lastName,
               type: "student",
               avatar: null,
            },
            _token: generateToken(userData),
         });
      })
      .catch((err) => {
         console.log(err);
         res.status(500).send({ status: false, msg: err });
      });
}

export async function patchUser(req, res) {
   const user = new Resource(userProfile);
   user.setSubject(req.user.userURI);

   const data = await user.fetch();
   user._fill(data);

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
      .then((data) => res.status(200).send({ status: true }))
      .catch((err) => res.status(500).send({ status: false, msg: err }));
}

export const registrationValidate = [
   body("user").exists(),
   body("user.first_name").exists().isString(),
   body("user.last_name").exists().isString(),
   body("user.email").exists().isEmail(),
   body("user.password").exists().isString(),
   body("privacy").exists(),
   body("privacy.use_nickname").exists().isBoolean(),
   body("privacy.public_profile").exists().isBoolean(),
   body("privacy.show_courses").exists().isBoolean(),
   body("privacy.show_badges").exists().isBoolean(),
   body("privacy.allow_contact").exists().isBoolean(),
   body("privacy.nickname")
      .if(body("privacy.use_nickname").custom((value) => value === true))
      .exists()
      .isString(),
];

export const loginValidate = [body("email").exists(), body("password").exists()];

export function deleteUser() {}
