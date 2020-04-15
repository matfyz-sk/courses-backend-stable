import { DataController } from "../controllers";
import { prepareResource } from "./prepareResource";
import { fetchResource } from "./fetchResource";
import { responseHandler } from "./responseHandler";

async function _modifyResource(req, res, next) {
   const resource = res.locals.resource;
   try {
      switch (req.method) {
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
      next();
   } catch (err) {
      next(err);
   }
}

export const modifyResource = [prepareResource, fetchResource, _modifyResource, responseHandler];
