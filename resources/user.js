import express from "express";
import { createUser, createUserValidation, getAllUsers, getUser, idValidation } from "../controllers/user";

const router = express.Router();

router.post("/", createUserValidation, createUser);
router.get("/", getAllUsers);
router.get("/:id", idValidation, getUser);

router.post("/:id/requestCourse/:courseId", (req, res) => {});
router.post("/:id/requestTeam/:teamId", (req, res) => {});
router.delete("/:id", async (req, res) => {});

exports.userRouter = router;
