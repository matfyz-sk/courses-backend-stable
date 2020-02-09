export function putResource(req, res) {
    const resource = res.locals.resource;
    Object.keys(resource.props).forEach(key => {
        if (req.body[key]) {
            resource.setPredicate(key, req.body[key]);
        }
    });
    resource.removeOld = false;
    resource
        .put()
        .then(data => res.status(200).send(data))
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
}
