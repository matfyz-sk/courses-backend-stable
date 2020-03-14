import { comment } from "./comment";

export const codeComment = {
   type: "codeComment",
   subclassOf: comment,
   props: {
      commentedText: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      commentedTextFrom: {
         required: true,
         multiple: false,
         dataType: "integer"
      },
      commentedTextTo: {
         required: true,
         multiple: false,
         dataType: "integer"
      },
      filePath: {
         required: false,
         multiple: false,
         dataType: "string"
      }
   }
};
