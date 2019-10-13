import { requests } from "../services";
import axios from "axios";

export const actions = {
  actionCallingApi,
  fetchAllTeams
};

function actionCallingApi(param1, param2) {
  return function(dispatch) {
    // call API requests here
    // then call classic Redux action
    var responseData = {
      foo: "example1",
      bar: "example2"
    };
    dispatch(classicAction(responseData));
  };
}

function fetchAllTeams(schema) {
  var data = JSON.stringify(schema);
  console.log("Data: ", data);
  return dispatch => {
    axios
      .get("http://localhost:3001/teams", {
        params: {
          data: data
        }
      })
      .then(res => {
        console.log("Response: ", res);
        dispatch(setTeams(res.data));
      })
      .catch(err => {
        console.error(err);
      });
  };
}

export const setTeams = res => ({
  type: "SET_TEAMS",
  teams: res
});

export const classicAction = responseData => ({
  type: "CLASSIC_ACTION",
  foo: responseData.foo,
  bar: responseData.bar
});
