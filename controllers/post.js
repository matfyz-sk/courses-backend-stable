export function storeResource(req, res) {
    const resource = res.locals.resource;
    var errors = [];
    Object.keys(resource.props).forEach(predicateName => {
        try {
            resource.setPredicate(predicateName, req.body[predicateName]);
        } catch (err) {
            errors.push(err);
        }
    });
    if (errors.length > 0) {
        return res.status(422).send({ status: false, msg: errors });
    }

    console.log("user data:", req.user);

    resource.isAbleToCreate(req.user);

    return res.send();

    resource
        .store()
        .then(data => res.status(201).send({ status: true, resource: resource.subject }))
        .catch(err => {
            console.log(err);
            res.status(500).send({ status: false, msg: err });
        });
}
