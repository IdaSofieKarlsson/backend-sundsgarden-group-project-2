import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: String,
  image: String
});

const Game = mongoose.model("Game", gameSchema, "games");

export default Game;
