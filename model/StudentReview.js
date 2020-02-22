import { Node, Data, Text } from "virtuoso-sparql-client";
import { percentage, reviewedStudent, studentComment, privateComment } from "../constants/predicates";
import StudentReview from "../constants/classes";

export const studentReview = {
    type: StudentReview,
    props: {
        [percentage.value]: { required: false, multiple: false, type: Data, dataType: "xsd:float", primitive: true },
        [reviewedStudent.value]: { required: false, multiple: false, type: Node, primitive: false },
        [studentComment.value]: { required: false, multiple: false, type: Text, primitive: true },
        [privateComment.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
