const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.sendStatus(200);
});

router.post("/", async (req, res) => {
  const data = req.body;
  const query = "INSERT DATA { }";
  res.status(200).send(req.body);
});

router.delete("/:id", async (req, res) => {
  const userId = `http://www.courses.matfyz.sk/user/${req.params.id}`;
  const query = "DELETE DATA {  }";
  res.status(200).send(req.params);
});

router.get("/:id", async (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
