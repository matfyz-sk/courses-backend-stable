import { event } from "./event";

export const block = {
   type: "block",
   subclassOf: event,
   create: ["{this}.courseInstance/^instructorOf.{userURI}"],
   props: {
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
      },
   },
};
