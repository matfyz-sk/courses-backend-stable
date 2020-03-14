export const agent = {
   type: "agent",
   subclasses: ["user", "team"],
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      avatar: {
         required: false,
         multiple: false,
         dataType: "string"
      }
   }
};
