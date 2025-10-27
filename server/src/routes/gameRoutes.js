import express from "express";

import { getAllGames } from "../controllers/gameController.js";

const gameRouter = express.Router();

gameRouter.get("/", getAllGames);

export default gameRouter;
