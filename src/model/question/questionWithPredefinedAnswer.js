import { question } from "./question";

export const questionWithPredefinedAnswer = {
   type: "questionWithPredefinedAnswer",
   subclassOf: question,
   props: {
      hasAnswer: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "predefinedAnswer",
      },
   },
};
