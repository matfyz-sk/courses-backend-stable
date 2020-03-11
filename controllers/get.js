import Query from "../query/Query";

export function runQuery(req, res) {
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = new Query(res.locals.resource.resource);
    query.generateQuery(req.query);
    query
        .run()
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({ status: false, msg: err }));
}
