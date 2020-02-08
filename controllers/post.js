import { getResourceObject } from "../helpers";

export function storeResource(resourceName, req, res) {
    const resource = getResourceObject(resourceName);
    if (!resource) {
        res.status(400).send("not implemented");
        return;
    }
    for (var p of resource.predicates) {
        if (p.required || req.body[p.predicate.value]) resource[p.predicate.value] = req.body[p.predicate.value];
    }
    resource
        .store()
        .then(data => res.status(201).send(resource.subject))
        .catch(err => res.status(500).send(err));
}
