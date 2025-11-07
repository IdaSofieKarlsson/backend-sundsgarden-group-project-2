import Game from "../models/gameModel.js";
import Session from "../models/sessionModel.js";

// Returnerar alla spel med summerad duration
export const getGamesWithMinutes = async (req, res) => {
  try {
    const games = await Game.find({});
    const sessions = await Session.find({});

    const gamesWithMinutes = games.map((game) => {
      // Summera alla duration för detta spel
      const totalMinutes = sessions
        .filter(
          (s) =>
            s.gameId.toString() === game._id.toString() // konvertera ObjectId till string
        )
        .reduce((sum, s) => sum + (s.duration || 0), 0);

      return {
        _id: game._id,
        title: game.title,
        image: game.image,
        minutes: totalMinutes, // här lägger vi till summerad duration
      };
    });

    res.json(gamesWithMinutes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch games with minutes" });
  }
};
