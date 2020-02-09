export function storeResource(req, res) {
    const resource = res.locals.resource;
    Object.keys(resource.props).forEach(predicateName => {
        if (resource.props[predicateName].required || req.body.hasOwnProperty(predicateName)) {
            resource.setPredicate(predicateName, req.body[predicateName]);
        }
    });
    resource
        .store()
        .then(data => res.status(201).send(resource.subject))
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
}
