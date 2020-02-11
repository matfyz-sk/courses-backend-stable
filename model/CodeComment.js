import { CodeComment } from "../constants/classes";
import { Node, Text, Data } from "virtuoso-sparql-client";
import { creator, commentTime, commentText, commentedText, commentedTextFrom, commentedTextTo, filePath } from "../constants/predicates";

export const codeComment = {
    type: CodeComment,
    props: {
        [creator.value]: { required: false, multiple: false, type: Node, primitive: false },
        [commentTime.value]: { required: false, multiple: false, type: Text, primitive: true },
        [commentText.value]: { required: false, multiple: false, type: Text, primitive: true },
        [commentedText.value]: { required: false, multiple: false, type: Text, primitive: true },
        [commentedTextFrom.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:integer",
            primitive: true
        },
        [commentedTextTo.value]: {
            required: false,
            multiple: false,
            type: Data,
            dataType: "xsd:integer",
            primitive: true
        },
        [filePath.value]: { required: false, multiple: false, type: Text, primitive: true }
    }
};
