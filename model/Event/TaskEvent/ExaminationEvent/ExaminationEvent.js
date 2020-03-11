import { ExaminationEvent } from "../../../../constants/classes";
import { taskEvent } from "../TaskEvent";

export const examinationEvent = {
    type: ExaminationEvent,
    subclassOf: taskEvent,
    subclasses: ["oralExam", "testTake"],
    props: {}
};
