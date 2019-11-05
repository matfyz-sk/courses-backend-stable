export const createUserRequest = {
    id: "/User",
    type: "object",
    properties: {
        name: { type: "string" },
        surname: { type: "string" },
        email: { type: "string" },
        about: { type: "string" },
        nickname: { type: "string" }
    },
    required: ["name", "surname", "email"]
};

export const createCourseRequest = {
    type: "object",
    properties: {
        name: { type: "string" },
        about: { type: "string" },
        abbreviation: { type: "string" },
        hasPrerequisite: {
            type: "array",
            items: { type: "string" }
        },
        mentions: {
            type: "array",
            items: { type: "string" }
        },
        covers: {
            type: "array",
            items: { type: "string" }
        }
    },
    required: ["name", "about", "abbreviation"]
};
