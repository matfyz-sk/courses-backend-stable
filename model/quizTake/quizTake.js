export const quizTake = {
   type: "quizTake",
   subclasses: ["quizTakePrototype"],
   props: {
      reviewedDate: {
         required: false,
         multiple: false,
         dataType: "dateTime",
         change: ["[this].ofQuizAssignment/courseInstance/^instructorOf.{userURI}"]
      },
      ofQuizAssignment: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "quizAssignment",
         change: ["admin"]
      }
   },
   create: "[this].ofQuizAssignment/assignedTo.{userURI}"
};
