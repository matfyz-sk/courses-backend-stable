import { taskEvent } from "../taskEvent";

export const quizAssignment = {
   type: "quizAssignment",
   subclassOf: taskEvent,
   subclasses: ["generatedQuizAssignment", "manualQuizAssignment"],
   props: {
      assignedTo: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "user",
      },
      hasQuizTake: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "quizTake",
      },
   },
};
