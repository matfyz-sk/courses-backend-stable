import React from "react";
import { actions } from "../actions";

class Simple extends React.Component {
  constructor(props) {
    super(props);
    this.requestJson = {
      "@context": {
        User: "http://www.courses.matfyz.sk/ontology#User"
      },
      "@graph": [
        {
          "@id": "?id",
          name: "?teamName"
        }
      ],
      $where: ["?id a courses:Team", "?id courses:name ?teamName"],
      $prefixes: {
        courses: "http://www.courses.matfyz.sk/ontology#"
      },
      $limit: 100
    };
  }
  action = e => {
    const { dispatch } = this.props;
    dispatch(actions.actionCallingApi());
  };
  fetchTeams = e => {
    const { dispatch } = this.props;
    dispatch(actions.fetchAllTeams(this.requestJson));
  };
  render() {
    return (
      <div className="simple">
        <h1>Simple component</h1>
        <p>{this.props.foo}</p>
        <p>{this.props.bar}</p>
        <button onClick={this.action}>change state</button>
        <button onClick={this.fetchTeams}>fetch teams</button>
        <pre>{JSON.stringify(this.props.teams, undefined, 2)}</pre>
      </div>
    );
  }
}

export default Simple;
