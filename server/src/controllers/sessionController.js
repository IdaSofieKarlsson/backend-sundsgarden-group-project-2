import Session from "../models/sessionModel.js";
import { z } from "zod";

// Get or create an active session for a user and game
export const getOrCreateSession = async (req, res) => {
  const sessionSchema = z.object({
    userId: z.string().length(24, "Invalid userId format"),
    gameId: z.string().length(24, "Invalid gameId format"),
  });

  try {
    const parseResult = sessionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parseResult.error.errors,
      });
    }

    const { userId, gameId } = parseResult.data;

    // Find any session for this user and game
    let session = await Session.findOne({
      userId,
      gameId,
    });

    // If no session, create a new one
    if (!session) {
      session = new Session({
        userId,
        gameId,
        startTime: new Date(),
        duration: 0,
      });
      await session.save();
    }

    res.status(200).json(session);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting or creating session", error });
  }
};

/*export const createSession = async (req, res) => {
  const sessionSchema = z.object({
    userId: z.string().length(24, "Invalid userId format"),
    gameId: z.string().length(24, "Invalid gameId format"),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    duration: z.number().optional(),
  });
  try {
    const parseResult = sessionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parseResult.error.errors,
      });
    }
    const { userId, gameId, startTime, endTime, duration } = parseResult.data;
    const newSession = new Session({
      userId,
      gameId,
      startTime,
      endTime,
      duration,
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: "Error creating session", error });
  }
};*/

// Update an existing session by adding to its duration
export const updateSession = async (req, res) => {
  const updateSchema = z.object({
    endTime: z.string().datetime(),
    duration: z.number(),
  });
  try {
    const { sessionId } = req.params;
    const parseResult = updateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parseResult.error.errors,
      });
    }
    const { endTime, duration } = parseResult.data;

    // Find the existing session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Add new duration to existing duration
    const newTotalDuration = (session.duration || 0) + duration;

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        endTime,
        duration: newTotalDuration,
      },
      { new: true }
    );
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: "Error updating session", error });
  }
};

// Get all sessions for a specific user
export const getSessionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions", error });
  }
};

// Get all sessions for a specific game
export const getSessionsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const sessions = await Session.find({ gameId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions", error });
  }
};

// Get top player for each game (leaderboard)
export const getLeaderboard = async (req, res) => {
  try {
    const Game = (await import("../models/gameModel.js")).default;
    const User = (await import("../models/userModel.js")).default;

    const games = await Game.find();

    const leaderboard = [];

    for (const game of games) {
      const topPlayer = await Session.aggregate([
        {
          $match: { gameId: game._id },
        },
        {
          $group: {
            _id: "$userId",
            totalDuration: { $sum: "$duration" },
          },
        },
        {
          $sort: { totalDuration: -1 },
        },
        {
          $limit: 1,
        },
      ]);

      if (topPlayer.length > 0) {
        const user = await User.findById(topPlayer[0]._id);

        if (user) {
          const hours = Math.floor(topPlayer[0].totalDuration / 60);
          const minutes = topPlayer[0].totalDuration % 60;

          leaderboard.push({
            id: game._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            title: game.title,
            timePlayed: `${hours} hours ${minutes} minutes`,
          });
        }
      }
    }

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};
