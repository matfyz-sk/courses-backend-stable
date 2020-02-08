import { getResourceObject } from "../helpers";

export function runQuery(resourceName, req, res) {
    const resource = getResourceObject(resourceName);
    if (!resource) {
        res.status(400).send("not implemented");
        return;
    }
    if (req.params.id) {
        req.query["id"] = req.params.id;
    }
    const query = resource.generateQuery(req.query);
    query
        .run()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => res.status(500).send(err));
}
