import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  game_id: Number,
  name: String,
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
