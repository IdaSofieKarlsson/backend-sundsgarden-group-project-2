import express from "express";

import {
  createSession,
  updateSession,
  getSessionsByUser,
  getSessionsByGame,
} from "../controllers/sessionController.js";

const sessionRouter = express.Router();

sessionRouter.post("/", createSession);
sessionRouter.patch("/:sessionId", updateSession);
sessionRouter.get("/user/:userId", getSessionsByUser);
sessionRouter.get("/game/:gameId", getSessionsByGame);

export default sessionRouter;
