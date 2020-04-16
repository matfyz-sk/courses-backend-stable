import { agent } from "./agent";

export const user = {
   type: "user",
   subclassOf: agent,
   props: {
      firstName: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      lastName: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      email: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      password: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      description: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      nickname: {
         required: true,
         multiple: false,
         dataType: "string",
      },
      publicProfile: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      showCourses: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      showBadges: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      allowContact: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      useNickName: {
         required: true,
         multiple: false,
         dataType: "boolean",
      },
      isSuperAdmin: {
         required: false,
         multiple: false,
         dataType: "boolean",
      },
      memberOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "team",
         change: ["owner", "[this].courseInstance/^studentOf.{userURI}"],
      },
      requests: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["owner", "[this].^studentOf.{userURI}"],
      },
      studentOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["[this].^instructorOf.{userURI}"],
      },
      instructorOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["admin"],
      },
      understands: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
         change: ["admin"],
      },
   },
};
