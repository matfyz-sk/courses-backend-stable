import { getResourceObject } from "../helpers";

export function putResource(resourceName, req, res) {
    const resource = getResourceObject(resourceName, req.params.id);
    if (!resource) {
        res.status(400).send("not implemented");
        return;
    }
    resource
        .fetch()
        .then(data => {
            resource._fill(resource.prepareData(data));
            for (var p of resource.predicates) {
                if (req.body[p.predicate.value]) resource[p.predicate.value] = req.body[p.predicate.value];
            }
            resource.removeOld = false;
            resource.put();
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            res.status(500).send(error);
        });
}
