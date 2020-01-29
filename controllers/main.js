export function deleteResource(resource, res) {
    //const course = new Course(buildUri(Constants.coursesURI, req.params.id, false));
    resource
        .fetch()
        .then(data => {
            resource._fill(resource.prepareData(data));
            resource.delete();
        })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send(err));
}

export function runQuery(query, res) {
    query
        .run()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => res.status(500).send(err));
}
