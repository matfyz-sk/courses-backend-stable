import { event } from "./event";

export const courseInstance = {
   type: "courseInstance",
   subclassOf: event,
   props: {
      instanceOf: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "course",
      },
   },
};
