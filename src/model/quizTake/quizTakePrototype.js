import { quizTake } from "./quizTake";

export const quizTakePrototype = {
   type: "quizTakePrototype",
   subclassOf: quizTake,
   create: [""],
   props: {
      orderedQuestion: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "orderedQuestion",
         change: ["owner"],
      },
   },
};
