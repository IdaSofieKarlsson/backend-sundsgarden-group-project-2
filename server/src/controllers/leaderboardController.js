import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import Game from "../models/gameModel.js";

// Get top player for each game
export const getLeaderboard = async (req, res) => {
  try {
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
