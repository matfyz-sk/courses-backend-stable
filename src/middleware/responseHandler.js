export function responseHandler(req, res) {
   res.status(200).send({ status: true, resource: res.locals.resource.subject });
}
