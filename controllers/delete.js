export function deleteResource(req, res) {
    const resource = res.locals.resource;
    if (!req.params.attributeName) {
        res.send(400).send("You must define attribute name to delete");
        return;
    }
    const attributeName = req.params.attributeName;
    if (!resource.props.hasOwnProperty(attributeName)) {
        res.send(400).send(`Attribute ${attributeName} is not relevant for this resource`);
        return;
    }
    // resource.setPredicateToDelete(attributeName, req.body.value)
    res.status(400).send("not implemented");
}
