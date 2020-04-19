import Resource from "../../resource";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import runQuery from "../../query";
import { user as userObj } from "../../model/agent/user";
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
   runQuery(userObj, { email: req.body.user.email })
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
   const { user, privacy } = req.body;
   const u = new Resource({ resource: userObj, setCreator: false });
   const hash = bcrypt.hashSync(user.password, 10);
   try {
      await u.setPredicate("firstName", user.first_name);
      await u.setPredicate("lastName", user.last_name);
      await u.setPredicate("email", user.email);
      await u.setPredicate("password", hash);
      await u.setPredicate("description", user.description ? user.description : "");
      await u.setPredicate("nickname", privacy.nickname ? privacy.nickname : "");
      await u.setPredicate("useNickName", privacy.use_nickname);
      await u.setPredicate("publicProfile", privacy.public_profile);
      await u.setPredicate("showCourses", privacy.show_courses);
      await u.setPredicate("showBadges", privacy.show_badges);
      await u.setPredicate("allowContact", privacy.allow_contact);
      await u.setPredicate("isSuperAdmin", false);
   } catch (err) {
      console.log(err);
      return res.status(200).send({ status: false, msg: err, user: null });
   }

   u.store()
      .then((data) => {
         let token = generateToken({ userURI: u.subject.iri, email: user.email });
         res.send({
            status: true,
            _token: token,
            user: {
               id: uri2id(u.subject.iri),
               fullURI: u.subject.iri,
               firstName: user.first_name,
               lastName: user.last_name,
               nickname: privacy.nickname ? privacy.nickname : null,
               email: user.email,
               avatar: user.avatar ? user.avatar : null,
               useNickName: privacy.use_nickname,
               publicProfile: privacy.public_profile,
               showCourses: privacy.show_courses,
               showBadges: privacy.show_badges,
               allowContact: privacy.allowContact,
               isSuperAdmin: false,
               studentOf: [],
               instructorOf: [],
               requests: [],
            },
         });
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).send({ status: false, message: err.message });
      });
}

export const register = [bodyValidation, checkValidation, emailIsFree, _register];
