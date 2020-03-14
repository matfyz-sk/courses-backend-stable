import { quizAssignment } from "./quizAssignment";

export const manualQuizAssignment = {
   type: "manualQuizAssignment",
   subclassOf: quizAssignment,
   props: {
      hasQuizTakePrototype: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "quizTakePrototype"
      }
   }
};
