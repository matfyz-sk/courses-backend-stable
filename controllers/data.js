import runQuery from "../query";

export function deleteResource(req, res) {
   const resource = res.locals.resource;
   if (req.params.attributeName != undefined) {
      resource.setPredicateToDelete(req.params.attributeName, req.body.value);
      resource
         .delete()
         .then(data => res.send({ status: true }))
         .catch(err => res.status(500).send({ status: false, msg: err }));
   } else {
      resource
         .completeDelete()
         .then(() => res.send({ status: true }))
         .catch(err => res.status(500).send({ status: false, msg: err }));
   }
}

export function getResource(req, res) {
   if (req.params.id) {
      req.query["id"] = req.params.id;
   }
   runQuery(res.locals.resource.resource, req.query)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send({ status: false, msg: err }));
}

export async function patchResource(req, res) {
   const resource = res.locals.resource;
   resource.removeOld = true;
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
      .patch()
      .then(data => res.status(200).send({ status: true }))
      .catch(err => res.status(500).send({ status: false, msg: err }));
}

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

export async function createResource(req, res) {
   const resource = res.locals.resource;

   try {
      await resource.setInputPredicates(req.body);
   } catch (err) {
      console.log(err);
      return res.status(422).send({ status: false, msg: err });
   }

   // resource.isAbleToCreate(req.user);

   resource
      .store(req.user.userURI)
      .then(data => res.status(201).send({ status: true, resource: resource.subject }))
      .catch(err => {
         console.log(err);
         res.status(500).send({ status: false, msg: err });
      });
}
