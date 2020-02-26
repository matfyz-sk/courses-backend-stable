export function deleteResource(req, res) {
    const resource = res.locals.resource;
    resource.setPredicateToDelete(req.params.attributeName, req.body.value);
    resource
        .delete()
        .then(data => res.send({ status: true }))
        .catch(err => res.status(500).send({ status: false, msg: err }));
}
