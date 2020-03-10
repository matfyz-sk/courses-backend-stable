import { Session, User } from "../../../constants/classes";
import { hasInstructor } from "../../../constants/predicates";
import { event } from "../Event";

export const session = {
    type: Session,
    subclassOf: event,
    subclasses: ["lecture", "lab"],
    props: {
        [hasInstructor.value]: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: User
        }
    },
    create: "teacher",
    roles: {
        teacher: "[this].courseInstance/^instructorOf.{userURI}",
        student: "[this].courseInstance/^studentOf.{userURI}"
    }
};
