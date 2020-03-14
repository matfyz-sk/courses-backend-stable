import { comment } from "./comment";

export const codeComment = {
   type: "codeComment",
   subclassOf: comment,
   props: {
      commentedText: {
         required: true,
         multiple: false,
         dataType: "string",
         change: ["[this].ofSubmission.ofAssignment.courseInstance.^instructorOf.{userURI}"]
      },
      commentedTextFrom: {
         required: true,
         multiple: false,
         dataType: "integer",
         change: ["[this].ofSubmission.ofAssignment.courseInstance.^instructorOf.{userURI}"]
      },
      commentedTextTo: {
         required: true,
         multiple: false,
         dataType: "integer",
         change: ["[this].ofSubmission.ofAssignment.courseInstance.^instructorOf.{userURI}"]
      },
      filePath: {
         required: false,
         multiple: false,
         dataType: "string",
         change: ["[this].ofSubmission.ofAssignment.courseInstance.^instructorOf.{userURI}"]
      }
   }
};
