import { event } from "../event";

export const taskEvent = {
   type: "taskEvent",
   subclassOf: event,
   subclasses: ["assignmentPeriod", "examinationEvent"],
   props: {
      extraTime: {
         required: false,
         multiple: false,
         dataType: "string"
      },
      task: {
         required: false,
         multiple: false,
         dataType: "node",
         objectClass: "task"
      }
   }
};
