export function putResource(req, res) {
    const resource = res.locals.resource;
    resource.removeOld = false;
    var errors = [];
    Object.keys(req.body).forEach(predicateName => {
        try {
            resource.setPredicate(predicateName, req.body[predicateName]);
        } catch (err) {
            errors.push(err);
        }
    });
    if (errors.length > 0) {
        return res.status(422).send({ status: false, msg: errors });
    }
    resource
        .put()
        .then(data => res.status(200).send({ status: true }))
        .catch(err => res.status(500).send({ status: false, msg: err }));
}
