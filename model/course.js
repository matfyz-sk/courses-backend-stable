export const course = {
   type: "course",
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
      abbreviation: {
         required: false,
         multiple: false,
         dataType: "string"
      },
      hasPrerequisite: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "course"
      },
      mentions: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic"
      },
      covers: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic"
      }
   },
   createPolicy: ["{isSuperAdmin}"]
};
