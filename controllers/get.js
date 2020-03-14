import runQuery from "../query";

export function getResource(req, res) {
   if (req.params.id) {
      req.query["id"] = req.params.id;
   }
   runQuery(res.locals.resource.resource, req.query)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send({ status: false, msg: err }));
}
