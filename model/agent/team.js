import { agent } from "./agent";

export const team = {
   type: "team",
   subclassOf: agent,
   props: {
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["admin"]
      }
   },
   create: ["[this].courseInstance/^studentOf.{userURI}"]
};
