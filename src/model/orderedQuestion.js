export const orderedQuestion = {
   type: "orderedQuestion",
   create: [""],
   props: {
      question: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "question",
         change: "[this].createdBy.{userURI}",
      },
      userAnswer: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "userAnswer",
         change: "[this].createdBy.{userURI}",
      },
      quizTake: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "quizTake",
      },
      previous: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "orderedQuestion",
         change: "[this].createdBy.{userURI}",
      },
   },
};
