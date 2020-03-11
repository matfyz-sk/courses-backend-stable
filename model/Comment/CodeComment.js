import { CodeComment } from "../../constants/classes";
import { commentedText, commentedTextFrom, commentedTextTo, filePath } from "../../constants/predicates";
import { comment } from "./Comment";

export const codeComment = {
    type: CodeComment,
    subclassOf: comment,
    props: {
        [commentedText.value]: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        [commentedTextFrom.value]: {
            required: true,
            multiple: false,
            dataType: "integer"
        },
        [commentedTextTo.value]: {
            required: true,
            multiple: false,
            dataType: "integer"
        },
        [filePath.value]: {
            required: false,
            multiple: false,
            dataType: "string"
        }
    }
};
