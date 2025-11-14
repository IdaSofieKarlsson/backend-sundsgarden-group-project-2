import Session from "../models/sessionModel.js";
import { z } from "zod";
import mongoose from 'mongoose';

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
/*
export const createSession = async (req, res) => {
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
};
*/
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

// Get total play time (sum of all durations) for a specific user
export const getTotalTimeByUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Missing userId query parameter" });
    }

    // Find all sessions for that user
    // Make sure 'duration' is the field in your DB model
    const sessions = await Session.find({ userId }).lean();

    // If no sessions, return zero
    if (!sessions || sessions.length === 0) {
      return res.status(200).json({
        userId,
        totalSeconds: 0,
        perGame: [],
      });
    }

    // Sum durations (use 0 if duration is missing)
    const totalSeconds = sessions.reduce(
      (sum, s) => sum + (typeof s.duration === "number" ? s.duration : 0),
      0
    );

    // Optional: compute per-game totals (gameId + totalSeconds)
    const perGameMap = sessions.reduce((acc, s) => {
      const gid = String(s.gameId);
      acc[gid] =
        (acc[gid] || 0) + (typeof s.duration === "number" ? s.duration : 0);
      return acc;
    }, {});
    const perGame = Object.entries(perGameMap).map(([gameId, seconds]) => ({
      gameId,
      totalSeconds: seconds,
    }));

    res.status(200).json({
      userId,
      totalSeconds,
      perGame,
    });
  } catch (error) {
    console.error("Error in getTotalTimeByUser:", error);
    res.status(500).json({
      message: "Error fetching total time",
      error: error.message || error,
    });
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

// Get total minutes played per game
export const getMinutesPerGame = async (req, res) => {
  try {
    const Game = (await import("../models/gameModel.js")).default;

    const games = await Game.find();

    const gameMinutes = [];

    for (const game of games) {
      const result = await Session.aggregate([
        {
          $match: { gameId: game._id },
        },
        {
          $group: {
            _id: null,
            totalMinutes: { $sum: "$duration" },
          },
        },
      ]);

      gameMinutes.push({
        gameName: game.title,
        minutes: result.length > 0 ? result[0].totalMinutes : 0,
      });
    }

    res.status(200).json(gameMinutes);
  } catch (error) {
    console.error("Error fetching minutes per game:", error);
    res.status(500).json({ message: "Error fetching minutes per game", error });
  }
};

// Get user activity data for line chart (daily playtime per user per game for last 7 days)
export const getUserActivityByGame = async (req, res) => {
  try {
    const Game = (await import("../models/gameModel.js")).default;
    const User = (await import("../models/userModel.js")).default;

    const games = await Game.find();
    const chartData = [];
    const colors = ["#808080", "#a9a9a9", "#c0c0c0", "#d3d3d3", "#e0e0e0"];

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    for (const game of games) {
      const userActivity = await Session.aggregate([
        {
          $match: {
            gameId: game._id,
            endTime: { $gte: sevenDaysAgo, $lte: today },
          },
        },
        {
          $project: {
            userId: 1,
            duration: 1,
            dayOfWeek: {
              $dateDiff: {
                startDate: sevenDaysAgo,
                endDate: "$endTime",
                unit: "day",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              userId: "$userId",
              day: "$dayOfWeek",
            },
            totalMinutes: { $sum: "$duration" },
          },
        },
        {
          $group: {
            _id: "$_id.userId",
            dailyData: {
              $push: {
                day: "$_id.day",
                minutes: "$totalMinutes",
              },
            },
          },
        },
      ]);

      const users = [];

      for (let i = 0; i < userActivity.length; i++) {
        const activity = userActivity[i];
        const user = await User.findById(activity._id);

        if (!user) {
          continue;
        }

        const dailyDataMap = new Map(
          activity.dailyData.map((d) => [d.day, d.minutes])
        );

        const dailyData = [];
        for (let day = 0; day < 7; day++) {
          dailyData.push({
            day: day + 1,
            minutes: dailyDataMap.get(day) || 0,
          });
        }

        users.push({
          userId: activity._id.toString(),
          userName: `${user.firstName} ${user.lastName}`,
          dailyData: dailyData,
          color: colors[i % colors.length],
        });
      }

      chartData.push({
        gameName: game.title,
        users: users,
      });
    }

    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({ message: "Error fetching user activity", error });
  }
};



export const getPlaytimePerGame = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId from params:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const sessions = await Session.find({ userId: objectUserId });
    console.log("Sessions found:", sessions.length);

    // Summera minuter per game
    const playtimeMap = {};
    sessions.forEach((s) => {
      const gameId = s.gameId.toString();
      playtimeMap[gameId] = (playtimeMap[gameId] || 0) + (s.duration || 0);
    });

    // Fasta Game 1–4
    const gameIds = Object.keys(playtimeMap).slice(0, 4);
    const result = [
      { _id: "Game 1", totalMinutes: playtimeMap[gameIds[0]] || 0 },
      { _id: "Game 2", totalMinutes: playtimeMap[gameIds[1]] || 0 },
      { _id: "Game 3", totalMinutes: playtimeMap[gameIds[2]] || 0 },
      { _id: "Game 4", totalMinutes: playtimeMap[gameIds[3]] || 0 },
    ];

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching playtime data:", error);
    res.status(500).json({ message: "Error fetching playtime data", error });
  }
};

// Get game statistics showing all users' play frequency and average time
export const getGameUserOverview = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    console.log("gameId from params:", gameId);

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid gameId" });
    }

    const objectGameId = new mongoose.Types.ObjectId(gameId);

    // Aggregate sessions by user for this specific game
    const userStats = await Session.aggregate([
      {
        // Filter sessions for this game only
        $match: { gameId: objectGameId }
      },
      {
        // Group by userId to get stats per user
        $group: {
          _id: "$userId",
          totalSessions: { $sum: 1 }, // Count number of sessions
          totalMinutes: { $sum: "$duration" } // Sum all durations in minutes
        }
      },
      {
        // Calculate average minutes per session
        $addFields: {
          times: "$totalSessions", // Number of times played
          timeMinutes: { 
            $cond: {
              if: { $gt: ["$totalSessions", 0] },
              then: { $round: [{ $divide: ["$totalMinutes", "$totalSessions"] }, 0] },
              else: 0
            }
          }
        }
      },
      {
        // Lookup user information
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        // Unwind user info array
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        // Project final structure
        $project: {
          _id: 0,
          userId: "$_id",
          times: 1,
          timeMinutes: 1,
          totalMinutes: 1, // Include for debugging
          userName: {
            $concat: [
              { $ifNull: ["$userInfo.firstName", "Unknown"] },
              " ",
              { $ifNull: ["$userInfo.lastName", ""] }
            ]
          }
        }
      },
      {
        // Sort by times played
        $sort: { times: -1 }
      }
    ]);

    console.log("User stats aggregated:", userStats);
    res.status(200).json(userStats);
  } catch (error) {
    console.error("Error fetching game user overview:", error);
    res.status(500).json({ message: "Error fetching game user overview", error });
  }
};
