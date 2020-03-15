import runQuery from "../query";

export async function deleteResource(req, res) {
   const resource = res.locals.resource;
   if (req.params.attributeName != undefined) {
      try {
         await resource.setPredicateToDelete(req.params.attributeName, req.body.value);
         resource.delete().then(() => res.send({ status: true }));
      } catch (err) {
         return res.status(500).send({ status: false, msg: err });
      }
   } else {
      resource
         .completeDelete()
         .then(() => res.send({ status: true }))
         .catch(err => res.status(500).send({ status: false, msg: err }));
   }
}

export function getResource(req, res) {
   req.user.superAdmin = true;

   if (Object.keys(req.query).length == 0 && req.params.id == undefined) {
      if (!req.user.superAdmin) {
         return res.status(401).send({ status: false, msg: "Request is not allowed" });
      }
   }

   if (req.params.id) {
      req.query["id"] = req.params.id;
   }

   runQuery(res.locals.resource.resource, req.query)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send({ status: false, msg: err }));
}

export async function updateResource(req, res) {
   const resource = res.locals.resource;
   resource.removeOld = req.method == "PATCH" ? true : false;
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
      .update()
      .then(data => res.status(200).send({ status: true }))
      .catch(err => res.status(500).send({ status: false, msg: err }));
}

export async function createResource(req, res) {
   const resource = res.locals.resource;
   try {
      await resource.isAbleToCreate();
      await resource.setInputPredicates(req.body);
      resource.store(req.user.userURI).then(data => res.status(201).send({ status: true, resource: resource.subject }));
   } catch (err) {
      console.log(err);
      return res.status(422).send({ status: false, msg: err });
   }
}
