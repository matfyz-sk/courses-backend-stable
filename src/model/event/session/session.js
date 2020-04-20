import { event } from "../event";

export const session = {
   type: "session",
   subclassOf: event,
   subclasses: ["lecture", "lab"],
   create: ["[this].courseInstance/^instructorOf.{userURI}"],
   props: {
      hasInstructor: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "user",
      },
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
      },
   },
};
