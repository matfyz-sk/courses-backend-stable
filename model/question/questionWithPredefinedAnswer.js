import { question } from "./question";

export const questionWithPredefinedAnswer = {
   type: "questionWithPreddefinedAnswer",
   subclassOf: question,
   props: {
      hasAnswer: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "userAnswer"
      }
   }
};
