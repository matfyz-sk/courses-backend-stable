export const userAnswer = {
   type: "userAnswer",
   subclasses: ["directAnswer", "orderedAnswer"],
   props: {
      score: {
         required: false,
         multiple: false,
         dataType: "float"
      },
      orderedQuestion: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "orderedQuestion"
      }
   }
};
