export const teamReview = {
   type: "teamReview",
   props: {
      reviewedBy: {
         required: true,
         multiple: false,
         type: "node",
         objectClass: "user",
         change: "{isAdmin}"
      },
      percentage: {
         required: true,
         multiple: false,
         dataType: "float",
         change: "ofSubmission.ofAssignment/courseInstance/^instructorOf.{userURI}"
      },
      reviewedStudent: {
         required: true,
         multiple: false,
         type: "node",
         objectClass: "user",
         change: "{isAdmin}"
      },
      studentComment: {
         required: false,
         multiple: false,
         type: "string",
         change: "ofSubmission.ofAssignment/courseInstance/^instructorOf.{userURI}"
      },
      privateComment: {
         required: false,
         multiple: false,
         type: "string",
         change: "ofSubmission.ofAssignment/courseInstance/^instructorOf.{userURI}"
      },
      ofSubmission: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "submission",
         change: "{isAdmin}"
      }
   },
   createPolicy: ["ofSubmission:submittedBy:", "reviewedBy:"]
};
