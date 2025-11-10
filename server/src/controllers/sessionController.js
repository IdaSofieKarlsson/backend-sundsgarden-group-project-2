/*import Session from "../models/sessionModel.js";
import { z } from "zod";

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
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { endTime, duration },
      { new: true }
    );
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: "Error updating session", error });
  }
};

export const getSessionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions", error });
  }
};

export const getSessionsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const sessions = await Session.find({ gameId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions", error });
  }
};
*/
import Session from "../models/sessionModel.js";
import { z } from "zod";

// Skapa en ny session
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

// Uppdatera en session
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
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { endTime, duration },
      { new: true }
    );

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: "Error updating session", error });
  }
};

// Hämta sessions för en viss användare
export const getSessionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions", error });
  }
};

// Hämta sessions för ett visst spel
export const getSessionsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const sessions = await Session.find({ gameId });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sessions", error });
  }
};
