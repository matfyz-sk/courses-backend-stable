import { DataController } from "../controllers";
import { prepareResource } from "./prepareResource";
import { responseHandler } from "./responseHandler";

async function _createResource(req, res, next) {
   try {
      await DataController.createResource(res.locals.resource, req.body);
      next();
   } catch (err) {
      next(err);
   }
}

export const createResource = [prepareResource, _createResource, responseHandler];
