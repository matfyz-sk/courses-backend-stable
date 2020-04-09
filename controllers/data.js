import runQuery from "../query";
import { ontologyURI } from "../constants";

export async function createResource(resource, data) {
   await resource.setInputPredicates(data);
   // await resource.isAbleToCreate();
   await resource.store();
}

export async function updateResource(resource, data) {
   for (var predicateName in data) {
      if (data.hasOwnProperty(predicateName)) {
         await resource.setPredicate(predicateName, data[predicateName]);
      }
   }
   await resource.store(false);
}

export async function deleteResource(resource, attributeName, attributeValue) {
   if (attributeName != undefined) {
      await resource.setPredicateToDelete(attributeName, attributeValue);
      await resource.store(false);
   } else {
      await resource.completeDelete();
   }
}

export async function getResource(resource, filters) {
   return await runQuery(resource, filters);
}

export function getResourceSubclasses(resource) {
   return resource.subclasses == undefined
      ? []
      : resource.subclasses.map((e) => ontologyURI + e.charAt(0).toUpperCase() + e.slice(1));
}
