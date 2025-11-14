import express from "express";

import {
  //createSession,
  updateSession,
  getSessionsByUser,
  getSessionsByGame,
  getOrCreateSession,
  getTotalTimeByUser,
  getLeaderboard,
  getMinutesPerGame,
  getUserActivityByGame,
  getPlaytimePerGame,
  getGameUserOverview
} from "../controllers/sessionController.js";

const sessionRouter = express.Router();

//sessionRouter.post("/", createSession);
sessionRouter.post("/get-or-create", getOrCreateSession);
sessionRouter.patch("/:sessionId", updateSession);
sessionRouter.get("/user/:userId", getSessionsByUser);
sessionRouter.get("/game/:gameId", getSessionsByGame);
sessionRouter.get("/total-time", getTotalTimeByUser);
sessionRouter.get("/leaderboard", getLeaderboard);
sessionRouter.get("/minutes-per-game", getMinutesPerGame);
sessionRouter.get("/user-activity", getUserActivityByGame);
sessionRouter.get("/user-overview/:userId", getPlaytimePerGame);
sessionRouter.get("/game-overview/:gameId", getGameUserOverview);



export default sessionRouter;
