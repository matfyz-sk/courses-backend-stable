import { body, param, validationResult } from "express-validator";
import * as Messages from "../constants/messages";
import * as Classes from "../constants/classes";
import { resourceExists } from "../helpers";

export function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else next();
}

// prettier-ignore
export const createAgent = [
    body("name").exists().withMessage(Messages.MISSING_FIELD),
    body("avatar").optional()
];

// prettier-ignore
export const createUser = [
    createAgent,
    body("firstName")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isString().withMessage(Messages.FIELD_NOT_STRING),
    body("lastName")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isString().withMessage(Messages.FIELD_NOT_STRING),
    body("email")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isEmail().withMessage(Messages.FIELD_NOT_EMAIL),
    body("description").exists().withMessage(Messages.MISSING_FIELD),
    body("nickname").exists().withMessage(Messages.MISSING_FIELD),
    validate
];

// prettier-ignore
export const createTeam = [
    createAgent,
    body("courseInstance")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isURL()
        .bail()
        .custom(value => resourceExists(value, Classes.CourseInstance)),
    validate
];

// prettier-ignore
export const createEvent = [
    body("subEvent").optional(),
    body("superEvent").optional(),
    body("startDate").exists().isISO8601(),
    body("endDate").exists().isISO8601(),
    body("uses").exists().isArray(),
    body("uses.*").custom(value => resourceExists(value, Classes.Material)),
    body("recommends").exists().isArray(),
    body("recommends.*").custom(value => resourceExists(value, Classes.Material)),
    body("covers").exists().isArray(),
    body("covers.*").custom(value => resourceExists(value, Classes.Topic)),
    body("mentions").exists().isArray(),
    body("mentions.*").custom(value => resourceExists(value, Classes.Topic)),
    body("requires").exists().isArray(),
    body("requires.*").custom(value => resourceExists(value, Classes.Topic)),
];

// prettier-ignore
export const createSession = [
    body("name").exists().withMessage(Messages.MISSING_FIELD),
    body("description").exists().withMessage(Messages.MISSING_FIELD),
    body("location").exists().withMessage(Messages.MISSING_FIELD),
    body("courseInstance")
        .exists().withMessage(Messages.MISSING_FIELD).bail()
        .isURL().bail()
        .custom(value => resourceExists(value, Classes.CourseInstance)),
    body("hasInstructor")
        .exists().withMessage(Messages.MISSING_FIELD)
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY)
        .not().isEmpty().withMessage("List of instructors cannot be empty"),
    body("hasInstructor.*")
        .isURL()
        .bail()
        .custom(value => resourceExists(value, Classes.User))
];

export const createLecture = [createEvent, createSession, validate];

export const createLab = [createEvent, createSession, validate];

// prettier-ignore
export const createCourseInstance = [
    createEvent,
    body("instanceOf")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .custom(value => resourceExists(value, Classes.Course)),
    body("year")
        .exists().withMessage(Messages.MISSING_FIELD),
    body("hasInstructor")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY),
    body("hasInstructor.*")
        .custom(value => resourceExists(value, Classes.User)),
    validate
];

// prettier-ignore
export const createCourse = [
    body("name").exists().withMessage(Messages.MISSING_FIELD),
    body("description").exists().withMessage(Messages.MISSING_FIELD),
    body("abbreviation").exists().withMessage(Messages.MISSING_FIELD),
    body("hasPrerequisite")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY),
    body("hasPrerequisite.*")
        .custom(value => resourceExists(value, Classes.Course)),
    body("mentions")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY),
    body("mentions.*")
        .custom(value => resourceExists(value, Classes.Topic)),
    body("covers")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY),
    body("covers.*")
        .custom(value => resourceExists(value, Classes.Topic)),
    validate
];

// prettier-ignore
export const createTopic = [
    body("name")
        .exists().withMessage(Messages.MISSING_FIELD)
        .bail()
        .isString().withMessage(Messages.FIELD_NOT_STRING),
    body("description").exists().withMessage(Messages.MISSING_FIELD),
    body("hasPrerequisite")
        .optional()
        .isArray().withMessage(Messages.FIELD_NOT_ARRAY),
    body("hasPrerequisite.*")
        .custom(value => resourceExists(value, Classes.Topic)),
    body("subtopicOf")
        .optional()
        .custom(value => resourceExists(value, Classes.Topic))
];
