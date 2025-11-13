import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import API_BASE_URL from "../api";

interface Game {
  id: string;
  title: string;
  progress: number;
}

interface TotalTimeResponse {
  userId: string;
  totalSeconds: number;
  perGame: { gameId: string; totalSeconds: number }[];
}

interface GameDbEntry {
  _id: string;
  title: string;
}

const GameProgressList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const { activeUser } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!activeUser?._id) return;

      try {
        // Fetch all games, to get the titles
        const gamesRes = await fetch(`${API_BASE_URL}/api/games`);
        const gameList: GameDbEntry[] = await gamesRes.json();

        // Build a lookup table: { gameId: title }
        const gameTitleMap: Record<string, string> = {};
        gameList.forEach((g) => {
          gameTitleMap[g._id] = g.title;
        });

        // Fetch session totals
        const sessionRes = await fetch(
          `${API_BASE_URL}/api/sessions/total-time?userId=${activeUser._id}`
        );
        const sessionData: TotalTimeResponse = await sessionRes.json();

        const total = sessionData.totalSeconds || 1; // avoid division by 0

        // Merge results: compute percentage + add titles
        const merged: Game[] = sessionData.perGame.map((g) => ({
          id: g.gameId,
          title: gameTitleMap[g.gameId] || "Unknown Game",
          progress: Math.round((g.totalSeconds / total) * 100),
        }));

        setGames(merged);
      } catch (error) {
        console.error("Error loading game progress:", error);
      }
    };

    fetchData();
  }, [activeUser]);

  const getProgressColor = (progress: number): string => {
    if (progress >= 50) return "#4a5568";
    if (progress >= 30) return "#718096";
    return "#a0aec0";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f7fafc",
      }}
    >
      <div
        style={{
          backgroundColor: "#e2e8f0",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "800px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {games.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: "24px" }}>
            No data yet
          </div>
        ) : (
          games.map((game, index) => (
            <div key={game.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "25px 0",
                }}
              >
                <div style={{ fontSize: "48px", marginRight: "30px" }}>👾</div>

                <div
                  style={{
                    flex: 1,
                    fontSize: "32px",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    color: "#000",
                  }}
                >
                  {game.title}
                </div>

                <div
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <svg
                    width="100"
                    height="100"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#cbd5e0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={getProgressColor(game.progress)}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 40 * (1 - game.progress / 100)
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "24px",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                      color: "#000",
                    }}
                  >
                    {game.progress}%
                  </div>
                </div>
              </div>

              {index < games.length - 1 && (
                <div
                  style={{
                    height: "2px",
                    backgroundColor: "#000",
                    margin: "0",
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameProgressList;
