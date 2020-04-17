export const question = {
   type: "question",
   subclasses: ["essayQuestion", "openQuestion", "questionWithPredefinedAnswer"],
   props: {
      name: {
         required: false,
         multiple: false,
         dataType: "string",
         change: ["owner"],
      },
      text: {
         required: false,
         multiple: false,
         dataType: "string",
         change: ["owner"],
      },
      visibilityIsRestricted: {
         required: false,
         multiple: false,
         dataType: "boolean",
         change: ["owner"],
      },
      hasQuestionState: {
         required: false,
         multiple: false,
         dataType: "string",
         change: ["owner"],
      },
      ofTopic: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "topic",
         change: ["owner"],
      },
      approver: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "user",
         change: ["[this].ofTopic.^covers/courseInstance/^instructorOf.{userURI}"],
      },
      hasChangeEvent: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "changeEvent",
         change: ["owner"],
      },
      comment: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "comment",
      },
      previous: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "question",
      },
   },
   create: ["[this].ofTopic/^covers/assignedTo.{userURI}"],
};
