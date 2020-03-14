export const question = {
   type: "question",
   subclasses: ["essayQuestion", "openQuestion", "questionWithPredefinedAnswer"],
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      text: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      visibilityIsRestricted: {
         required: false,
         multiple: false,
         dataType: "boolean"
      },
      hasQuestionState: {
         required: false,
         multiple: false,
         dataType: "string"
      },
      ofTopic: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "topic"
      },
      hasAuthor: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "user"
      },
      hasComment: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "questionComment"
      },
      approver: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "user"
      },
      hasChangeEvent: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "changeEvent"
      }
   },
   createPolicy: ["ofTopic:^covers/assignedTo:{userURI}"]
};
