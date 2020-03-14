export const comment = {
   type: "comment",
   subclasses: ["codeComment"],
   props: {
      commentText: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      ofSubmission: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "submission"
      },
      ofQuestion: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "question"
      },
      ofComment: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "comment"
      }
   }
};
