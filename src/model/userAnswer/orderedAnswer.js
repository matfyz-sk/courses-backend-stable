import { userAnswer } from "./userAnswer";

export const orderedAnswer = {
   type: "orderedAnswer",
   subclassOf: userAnswer,
   props: {
      position: {
         required: true,
         multiple: false,
         dataType: "integer"
      },
      userChoice: {
         required: true,
         multiple: false,
         dataType: "boolean"
      },
      predefinedAnswer: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "predefinedAnswer"
      }
   }
};
