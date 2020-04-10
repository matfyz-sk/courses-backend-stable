import { userAnswer } from "./userAnswer";

export const directAnswer = {
   type: "directAnswer",
   subclassOf: userAnswer,
   props: {
      text: {
         required: true,
         multiple: false,
         dataType: "string"
      }
   }
};
