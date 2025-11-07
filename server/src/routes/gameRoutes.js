import express from "express";

import { getGamesWithMinutes } from "../controllers/gameController.js";
const gameRouter = express.Router();

gameRouter.get("/", getGamesWithMinutes);

export default gameRouter;
