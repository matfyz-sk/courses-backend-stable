import { event } from "./event";

export const block = {
   type: "block",
   subclassOf: event,
   props: {
      courseInsntace: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
      },
   },
};
