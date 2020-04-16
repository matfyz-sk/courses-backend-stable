export const teamReview = {
   type: "teamReview",
   props: {
      percentage: {
         required: true,
         multiple: false,
         dataType: "float",
         change: "[this].ofSubmission/ofAssignment/courseInstance/^instructorOf.{userURI}",
      },
      reviewedStudent: {
         required: true,
         multiple: false,
         type: "node",
         objectClass: "user",
         change: "admin",
      },
      studentComment: {
         required: false,
         multiple: false,
         type: "string",
         change: "[this].ofSubmission/ofAssignment/courseInstance/^instructorOf.{userURI}",
      },
      privateComment: {
         required: false,
         multiple: false,
         type: "string",
         change: "[this].ofSubmission/ofAssignment/courseInstance/^instructorOf.{userURI}",
      },
      ofSubmission: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "submission",
         change: "admin",
      },
   },
   create: [],
};
