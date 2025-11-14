import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import API_BASE_URL from "../api";

// TypeScript interface
interface TotalTimeResponse {
  userId: string;
  totalSeconds: number;
  perGame: { gameId: string; totalSeconds: number }[];
}

const TotalTimeDashboard: React.FC = () => {
  const [totalTime, setTotalTime] = useState<number>(0);
  const navigate = useNavigate();
  const { activeUser } = useUser();

  //Fetch data from backend
  useEffect(() => {
    const fetchTotalTime = async () => {
      if (!activeUser?._id) return; // wait until user is selected

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/sessions/total-time?userId=${activeUser._id}`
        );
        if (!response.ok) {
          const text = await response.text();
          console.error("Total time fetch failed:", response.status, text);
          return;
        }
        const data: TotalTimeResponse = await response.json();
        setTotalTime(data.totalSeconds ?? 0);
      } catch (error) {
        console.error("Error fetching total time:", error);
      }
    };

    fetchTotalTime();
  }, [activeUser]);

  const handleChoosePlayer = () => {
    console.log("Choose new player clicked");
    navigate("/users");
  };

  const handlePlayNewGame = () => {
    console.log("Play new game clicked");
    if (activeUser) {
      navigate("/games");
    } else {
      alert("Please select a player first");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Total Time Card */}
      <div
        style={{
          backgroundColor: "#e8e8e8",
          borderRadius: "20px",
          padding: "50px 100px",
          marginBottom: "60px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "850px",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            color: "#000",
            marginBottom: "10px",
            lineHeight: "1",
          }}
        >
          {totalTime} min
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "500",
            color: "#000",
          }}
        >
          Total time played
        </div>
      </div>

      {/* Buttons Container */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          width: "100%",
          maxWidth: "500px",
          justifyContent: "center",
        }}
      >
        {/* Choose New Player Button */}
        <button
          onClick={handleChoosePlayer}
          style={{
            flex: 1,
            maxWidth: "400px",
            height: "150px",
            backgroundColor: "#6b6b6b",
            border: "4px solid #000",
            borderRadius: "10px",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#585858";
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#6b6b6b";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
          }}
        >
          Choose new player
        </button>

        {/* Play New Game Button */}
        <button
          onClick={handlePlayNewGame}
          style={{
            flex: 1,
            maxWidth: "400px",
            height: "150px",
            backgroundColor: "#6b6b6b",
            border: "4px solid #000",
            borderRadius: "10px",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#585858";
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#6b6b6b";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
          }}
        >
          Play new Game
        </button>
      </div>
    </div>
  );
};

export default TotalTimeDashboard;
