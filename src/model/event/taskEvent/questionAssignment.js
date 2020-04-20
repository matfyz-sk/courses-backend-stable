import { taskEvent } from "./taskEvent";

export const questionAssignment = {
   type: "questionAssignment",
   subclassOf: taskEvent,
   props: {
      assignedTo: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "user",
      },
   },
};
