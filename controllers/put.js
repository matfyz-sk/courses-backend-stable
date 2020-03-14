export async function putResource(req, res) {
   const resource = res.locals.resource;
   resource.removeOld = false;
   for (var predicateName in req.body) {
      if (req.body.hasOwnProperty(predicateName)) {
         try {
            await resource.setPredicate(predicateName, req.body[predicateName]);
         } catch (err) {
            return res.status(422).send({ status: false, msg: err });
         }
      }
   }
   resource
      .put()
      .then(data => res.status(200).send({ status: true }))
      .catch(err => res.status(500).send({ status: false, msg: err }));
}
