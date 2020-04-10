export const review = {
   type: "review",
   props: {
      hasQuestionAnswer: {
         required: true,
         multiple: true,
         dataType: "node",
         objectClass: "reviewQuestionAnswer"
      },
      reviewedByStudent: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "user"
      },
      reviewedByTeam: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "team"
      },
      submittedAt: {
         required: false,
         multiple: false,
         dataType: "dateTime"
      },
      ofSubmission: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "submission"
      }
   }
};
