import { agent } from "./agent";

export const user = {
   type: "user",
   subclassOf: agent,
   props: {
      memberOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "team",
         change: ["owner", "[this].courseInstance/^studentOf.{userURI}"]
      },
      requests: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["owner", "[this].^studentOf.{userURI}"]
      },
      studentOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["[this].^instructorOf.{userURI}"]
      },
      instructorOf: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["admin"]
      },
      understands: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
         change: ["admin"]
      },
      useNickName: {
         required: false,
         multiple: true,
         dataType: "boolean",
         change: ["owner"]
      }
   }
};
