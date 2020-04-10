export const field = {
   type: "field",
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
      ofType: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "fieldType"
      }
   },
   create: "admin",
   completeDelete: "superAdmin"
};
