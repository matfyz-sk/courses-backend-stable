import { body } from "express-validator";
import bcrypt from "bcrypt";
import runQuery from "../../query";
import { user } from "../../model/agent/user";
import { generateToken, uri2id } from "../../helpers";
import { checkValidation } from "./checkValidation";

const bodyValidation = [body("email").exists(), body("password").exists()];

function _login(req, res) {
   runQuery(user, { email: req.body.email })
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
               id: uri2id(userData["@id"]),
               fullURI: userData["@id"],
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

export const login = [bodyValidation, checkValidation, _login];
