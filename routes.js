const express = require('express');
const router = express.Router();

const {
  Client
} = require('virtuoso-sparql-client');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/local', (req, res) => {
  const graphName = req.body.graphName;
  const query = req.body.query;
  const format = req.body.format;

  const localClient = new Client('http://localhost:8890/sparql');
  localClient.setQueryFormat(format);
  localClient.setQueryGraph(graphName);

  localClient.query(query)
    .then((results) => {
      res.render('results', {
        results: results,
        format: format
      });
    })
    .catch((err) => {
      console.log(err);
      res.send('Error!');
    });
});

module.exports = router;