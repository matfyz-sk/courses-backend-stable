export const agent = {
   type: "agent",
   subclasses: ["user", "team"],
   props: {
      avatar: {
         required: false,
         multiple: false,
         dataType: "string",
         change: ["owner"],
      },
   },
};
