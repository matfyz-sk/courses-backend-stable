import Resource from "../../resource";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import runQuery from "../../query";
import { user } from "../../model/agent/user";
import { generateToken, uri2id } from "../../helpers";
import { checkValidation } from "./checkValidation";

const bodyValidation = [
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

export function emailIsFree(req, res, next) {
   runQuery(user, { email: req.body.user.email })
      .then((data) => {
         if (data["@graph"].length != 0) {
            return res
               .status(200)
               .send({ status: false, msg: "Email is already registered!", user: null });
         }
         next();
      })
      .catch((err) => {
         res.status(500).send(err);
      });
}

async function _register(req, res, next) {
   const u = new Resource({ resource: user, setCreator: false });
   const hash = bcrypt.hashSync(req.body.user.password, 10);
   try {
      await u.setPredicate("firstName", req.body.user.first_name);
      await u.setPredicate("lastName", req.body.user.last_name);
      await u.setPredicate("email", req.body.user.email);
      await u.setPredicate("password", hash);
      await u.setPredicate("useNickName", req.body.privacy.use_nickname);
      await u.setPredicate("publicProfile", req.body.privacy.public_profile);
      await u.setPredicate("showCourses", req.body.privacy.show_courses);
      await u.setPredicate("showBadges", req.body.privacy.show_badges);
      await u.setPredicate("allowContact", req.body.privacy.allow_contact);
      await u.setPredicate("description", req.body.user.description);
      await u.setPredicate("nickname", req.body.privacy.nickname);
   } catch (err) {
      console.log(err);
      return res.status(200).send({ status: false, msg: err, user: null });
   }

   u.store()
      .then((data) => {
         let token = generateToken({ userURI: u.subject.iri, email: req.body.user.email });
         res.send({
            status: true,
            user: {
               id: uri2id(u.subject.iri),
               fullURI: u.subject.iri,
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

export const register = [bodyValidation, checkValidation, emailIsFree, _register];
