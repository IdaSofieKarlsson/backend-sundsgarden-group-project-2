import express from "express";

import {
  //createSession,
  updateSession,
  getSessionsByUser,
  getSessionsByGame,
  getOrCreateSession,
  getLeaderboard,
} from "../controllers/sessionController.js";

const sessionRouter = express.Router();

//sessionRouter.post("/", createSession);
sessionRouter.post("/get-or-create", getOrCreateSession);
sessionRouter.patch("/:sessionId", updateSession);
sessionRouter.get("/user/:userId", getSessionsByUser);
sessionRouter.get("/game/:gameId", getSessionsByGame);
sessionRouter.get("/leaderboard", getLeaderboard);

export default sessionRouter;
