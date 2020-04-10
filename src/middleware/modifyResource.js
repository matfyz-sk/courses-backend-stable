import { DataController } from "../controllers";

export async function modifyResource(req, res, next) {
   const resource = res.locals.resource;
   try {
      switch (req.method) {
         case "POST":
            await DataController.createResource(resource, req.body);
            break;
         case "PUT":
            resource.removeOld = false;
            await DataController.updateResource(resource, req.body);
            break;
         case "PATCH":
            resource.removeOld = true;
            await DataController.updateResource(resource, req.body);
            break;
         case "DELETE":
            await DataController.deleteResource(resource, req.params.attributeName, req.body.value);
            break;
         default:
            break;
      }
      res.status(200).send({ status: true, resource: resource.subject });
   } catch (err) {
      next(err);
   }
}
