export const task = {
   type: "task",
   subclasses: ["assignment", "questionAssignment", "quizAssignment"],
   props: {
      name: {
         required: true,
         multiple: false,
         dataType: "string",
         change: ["[this].courseInstance/^instructorOf.{userURI}"]
      },
      description: {
         required: false,
         multiple: false,
         dataType: "string",
         change: ["[this].courseInstance/^instructorOf.{userURI}"]
      },
      covers: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
         change: ["[this].courseInstance/^instructorOf.{userURI}"]
      },
      mentions: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
         change: ["[this].courseInstance/^instructorOf.{userURI}"]
      },
      requires: {
         required: false,
         multiple: true,
         dataType: "node",
         objectClass: "topic",
         change: ["[this].courseInstance/^instructorOf.{userURI}"]
      },
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
         change: ["owner,admin"]
      }
   },
   create: ["[this].courseInstance/^instructorOf.{userURI}"]
};
