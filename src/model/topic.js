export const topic = {
   type: "topic",
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      description: {
         required: false,
         multiple: false,
         dataType: "string"
      },
      hasPrerequisite: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "topic"
      },
      subtopicOf: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "topic"
      },
      hasQuestionAssignment: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "questionAssignment"
      }
   },
   create: ["{userURI}.instructorOf.?courseInstance"]
};
