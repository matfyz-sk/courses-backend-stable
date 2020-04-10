export const comment = {
   type: "comment",
   subclasses: ["codeComment"],
   props: {
      commentText: {
         required: true,
         multiple: false,
         dataType: "string",
         change: ["owner"]
      },
      ofSubmission: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "submission",
         change: ["superAdmin"]
      },
      ofQuestion: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "question",
         change: ["superAdmin"]
      },
      ofComment: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "comment",
         change: ["superAdmin"]
      }
   }
};
