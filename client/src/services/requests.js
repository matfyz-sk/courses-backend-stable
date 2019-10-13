import axios from "axios";
import config from "../config/config";

export const requests = {
  get,
  post
};

function get(apiEndpoint) {
  return axios
    .get(config.baseUrl + apiEndpoint, getOptions())
    .then(response => {
      return response;
    })
    .catch(err => {
      console.log("Error in response");
      console.log(err);
    });
}

function post(apiEndpoint, payload) {
  return axios
    .post(config.baseUrl + apiEndpoint, payload, getOptions())
    .then(response => {
      return response;
    })
    .catch(err => {
      console.log(err);
    });
}

function getOptions() {
  let options = {};
  if (localStorage.getItem("token")) {
    options.headers = { "x-access-token": localStorage.getItem("token") };
  }
  return options;
}
