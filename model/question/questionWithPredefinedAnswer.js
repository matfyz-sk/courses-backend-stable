import { question } from "./question";

export const questionWithPredefinedAnswer = {
   type: "questionWithPredefinedAnswer",
   subclassOf: question,
   props: {
      hasAnswer: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "predefinedAnswer",
      },
   },
};
