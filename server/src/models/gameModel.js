import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: Number,
  name: String,
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
