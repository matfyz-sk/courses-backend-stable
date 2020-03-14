export const userProfile = {
   type: "user",
   props: {
      firstName: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      lastName: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      email: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      password: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      description: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      nickname: {
         required: true,
         multiple: false,
         dataType: "string"
      },
      publicProfile: {
         required: true,
         multiple: false,
         dataType: "boolean"
      },
      showCourses: {
         required: true,
         multiple: false,
         dataType: "boolean"
      },
      showBadges: {
         required: true,
         multiple: false,
         dataType: "boolean"
      },
      allowContact: {
         required: true,
         multiple: false,
         dataType: "boolean"
      },
      useNickName: {
         required: true,
         multiple: false,
         dataType: "string"
      }
   }
};
