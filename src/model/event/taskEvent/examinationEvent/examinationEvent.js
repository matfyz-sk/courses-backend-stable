import { taskEvent } from "../taskEvent";

export const examinationEvent = {
   type: "examinationEvent",
   subclassOf: taskEvent,
   subclasses: ["oralExam", "testTake"],
   props: {}
};
