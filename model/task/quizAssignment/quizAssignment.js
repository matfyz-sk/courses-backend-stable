import { task } from "../task";

export const quizAssignment = {
   type: "quizAssignment",
   subclassOf: task,
   subclasses: ["generatedQuizAssignment", "manualQuizAssignment"],
   props: {
      assignedTo: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "user"
      },
      hasQuizTake: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "quizTake"
      },
      hasAuthor: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "user"
      },
      takingEvent: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "taskEvent"
      }
   }
};
