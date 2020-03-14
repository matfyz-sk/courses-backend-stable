import { agent } from "./agent";

export const user = {
   type: "user",
   subclassOf: agent,
   props: {
      memberOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "team"
      },
      requests: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance"
      },
      studentOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance"
      },
      instructorOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance"
      },
      understands: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic"
      },
      useNickName: {
         required: false,
         multiple: true,
         dataType: "boolean"
      }
   },
   profile: {
      firstName: {
         required: false,
         multiple: false,
         dataType: "string"
      },
      lastName: {
         required: false,
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
         required: false,
         multiple: false,
         dataType: "string"
      },
      nickname: {
         required: false,
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
      }
   }
};
