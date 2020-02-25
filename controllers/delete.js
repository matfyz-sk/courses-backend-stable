export function deleteResource(req, res) {
    const resource = res.locals.resource;
    resource.setPredicateToDelete(req.params.attributeName, req.body.value);
    resource
        .delete()
        .then(data => res.send("OK"))
        .catch(err => res.status(500).send(err));
}
