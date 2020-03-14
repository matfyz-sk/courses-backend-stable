export const topicAppearance = {
   type: "topicAppearance",
   props: {
      amount: {
         required: false,
         multiple: false,
         dataType: "integer"
      },
      topic: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "topic"
      }
   }
};
