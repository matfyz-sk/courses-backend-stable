import { quizTake } from "./quizTake";

export const quizTakePrototype = {
   type: "quizTakePrototype",
   subclassOf: quizTake,
   props: {
      orderedQuestion: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "orderedQuestion",
         change: "[this].createdBy.{userURI}"
      }
   }
};
