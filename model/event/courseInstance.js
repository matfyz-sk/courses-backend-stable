import { event } from "./event";

export const courseInstance = {
   type: "courseInstance",
   subclassOf: event,
   props: {
      year: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      instanceOf: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "course"
      }
   },
   createPolicy: ["{isAdmin}"]
};
