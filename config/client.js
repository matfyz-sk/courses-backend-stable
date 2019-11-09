import { Client } from "virtuoso-sparql-client";
import * as Constants from "../constants";

const db = new Client(Constants.virtuosoEndpoint);
db.addPrefixes({
    courses: Constants.ontologyURI
});
db.setQueryFormat("application/json");
db.setQueryGraph(Constants.graphURI);
db.setDefaultGraph(Constants.graphURI);

exports.db = db;
