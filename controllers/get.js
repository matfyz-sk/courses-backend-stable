export function runQuery(req, res) {
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = res.locals.resource.generateQuery(req.query);
    query
        .run()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => res.status(500).send(err));
}
