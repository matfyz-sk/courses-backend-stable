export function patchResource(req, res) {
    const resource = res.locals.resource;
    resource.removeOld = true;
    var errors = [];
    Object.keys(req.body).forEach(predicateName => {
        if (!resource.props.hasOwnProperty(predicateName)) {
            errors.push({
                predicateName: predicateName,
                msg: "Predicate name is not relevant for this resource"
            });
            return;
        }
        if (!resource.props[predicateName].value) {
            errors.push({
                predicateName: predicateName,
                msg: "Value of this predicate is not defined"
            });
            return;
        }
        resource.setPredicate(predicateName, req.body[predicateName]);
    });
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    resource
        .patch()
        .then(data => res.status(200).send(data))
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
}
