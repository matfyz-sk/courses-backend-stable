export async function storeResource(req, res) {
    const resource = res.locals.resource;

    try {
        await resource.setInputPredicates(req.body);
    } catch (err) {
        console.log(err);
        return res.status(422).send({ status: false, msg: err });
    }

    //console.log(resource.props.initialSubmissionPeriod.value.props);

    //return res.send();

    // for (var predicateName in resource.props) {
    //     if (resource.props.hasOwnProperty(predicateName)) {
    //         try {
    //             await resource.setPredicate(predicateName, req.body[predicateName]);
    //         } catch (err) {
    //             // errors.push(err);
    //             return res.status(422).send({ status: false, msg: err });
    //         }
    //     }
    // }

    // if (errors.length > 0) {
    //     return res.status(422).send({ status: false, msg: errors });
    // }

    // console.log("user data:", req.user);
    // resource.isAbleToCreate(req.user);
    // return res.send();

    resource
        .store(req.user.userURI)
        .then(data => res.status(201).send({ status: true, resource: resource.subject }))
        .catch(err => {
            console.log(err);
            res.status(500).send({ status: false, msg: err });
        });
}
