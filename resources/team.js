import express from "express";
import { getAllTeams, getTeam, createTeamValidation, createTeam } from "../controllers/team";

const router = express.Router();

router.post("/", createTeamValidation, createTeam);
router.get("/", getAllTeams);
router.get("/:id", getTeam);

exports.teamsRouter = router;
