import { event } from "../event";

export const taskEvent = {
   type: "taskEvent",
   subclassOf: event,
   subclasses: ["assignmentPeriod", "examinationEvent", "questionAssignment", "quizAssignment"],
   props: {
      extraTime: {
         required: false,
         multiple: false,
         dataType: "string",
      },
      task: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "task",
      },
      courseInstance: {
         required: true,
         multiple: false,
         dataType: "node",
         objectClass: "courseInstance",
      },
   },
   create: ["[this].courseInstance/^instructorOf.{userURI}"],
};
