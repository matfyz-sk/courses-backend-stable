export const agent = {
   type: "agent",
   subclasses: ["user", "team"],
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string",
         name: ["admin"]
      },
      avatar: {
         required: false,
         multiple: false,
         dataType: "string",
         change: ["owner"]
      }
   }
};
