import React, { useState, useEffect } from "react";

// TypeScript interfaces
interface LeaderboardEntry {
  id: string;
  name: string;
  title: string;
  timePlayed: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        const data: LeaderboardEntry[] = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard data");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "24px",
        }}
      >
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "24px",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#e8e8e8",
          borderRadius: "12px",
          padding: "30px 40px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#000",
            textAlign: "center",
            marginBottom: "25px",
            marginTop: "0",
          }}
        >
          Leaderboard
        </h1>

        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "2px solid #000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#c0c0c0" }}>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#000",
                  border: "2px solid #000",
                  borderTop: "none",
                  borderLeft: "none",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#000",
                  border: "2px solid #000",
                  borderTop: "none",
                }}
              >
                Game
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#000",
                  border: "2px solid #000",
                  borderTop: "none",
                  borderRight: "none",
                }}
              >
                Time Played
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#666",
                    border: "2px solid #000",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                  }}
                >
                  No leaderboard data available. Play some games to see the top
                  players!
                </td>
              </tr>
            ) : (
              leaderboardData.map((entry, index) => (
                <tr
                  key={entry.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#e8e8e8" : "#d0d0d0",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#000",
                      border: "2px solid #000",
                      borderLeft: "none",
                    }}
                  >
                    {entry.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#000",
                      border: "2px solid #000",
                    }}
                  >
                    {entry.title}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      color: "#000",
                      border: "2px solid #000",
                      borderRight: "none",
                      borderBottom:
                        index === leaderboardData.length - 1
                          ? "none"
                          : "2px solid #000",
                    }}
                  >
                    {entry.timePlayed}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
