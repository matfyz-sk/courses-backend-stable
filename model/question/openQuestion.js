import { question } from "./question";

export const openQuestion = {
   type: "openQuestion",
   subclassOf: question,
   props: {
      regexp: {
         required: false,
         multiple: false,
         dataType: "string"
      }
   }
};
