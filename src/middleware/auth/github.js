import axios from "axios";
import { user } from "../../model/agent/user";

const GITHUB_GET_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_GET_USER_URL = "https://api.github.com/user";
const GITHUB_CLIENT_ID = "f937b5e763fd295e11b9";
const GITHUB_CLIENT_SECRET = "b0cb4f40f0065a50f5ab671089de7208cf592614";

export function githubLogin(req, res) {
   const code = req.query.code;
   axios
      .post(GITHUB_GET_TOKEN_URL, {
         client_id: GITHUB_CLIENT_ID,
         client_secret: GITHUB_CLIENT_SECRET,
         code,
      })
      .then((resp) => {
         const access_token = resp.data.split("&")[0].split("=")[1];
         return axios.get(`${GITHUB_GET_USER_URL}?access_token=${access_token}`);
      })
      .then((resp) => {
         const email = resp.email;
         if (!email) {
            return res.status(200).send({
               status: false,
               msg: "Empty email",
            });
         }
         return runQuery(user, { email });
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
