const { Client, Node, Text, Data, Triple } = require("virtuoso-sparql-client");
const ID = require("virtuoso-uid");
const sparqlTransformer = require("sparql-transformer");
const express = require("express");
const router = express.Router();
