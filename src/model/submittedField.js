export const subbmittedField = {
   type: "submittedField",
   props: {
      field: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "field"
      },
      value: {
         required: true,
         multiple: false,
         dataType: "string"
      }
   }
};
