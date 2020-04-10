import { question } from "./question";

export const questionWithPredefinedAnswer = {
   type: "questionWithPredefinedAnswer",
   subclassOf: question,
   props: {
      hasAnswer: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "predefinedAnswer",
      },
   },
};
