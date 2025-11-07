import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  startTime: Date,
  endTime:  Date,
  duration: Number
});

const Session = mongoose.model("Session", sessionSchema, "sessions");

export default Session;
