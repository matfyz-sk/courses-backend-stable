import { task } from "./task";

export const questionAssignment = {
   type: "questionAssignment",
   subclassOf: task,
   props: {
      creationPeriod: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "taskEvent"
      },
      assignedTo: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "user"
      }
   }
};
