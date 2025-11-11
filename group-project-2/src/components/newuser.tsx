import React, { useState } from "react"; // add uueEffect when used
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

// TypeScript interface
//interface TimeData {
//  totalMinutes: number;
//}

const TotalTimeDashboard: React.FC = () => {
  const [totalTime, _setTotalTime] = useState<number>(164);
  const navigate = useNavigate();
  const { activeUser } = useUser();

  // Fetch data from backend - uncomment when ready
  /*
  useEffect(() => {
    const fetchTotalTime = async () => {
      try {
        const response = await fetch('/api/total-time');
        const data: TimeData = await response.json();
        setTotalTime(data.totalMinutes);
      } catch (error) {
        console.error('Error fetching total time:', error);
      }
    };

    fetchTotalTime();
  }, []);
  */

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
        minHeight: "100vh",
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
          maxWidth: "900px",
          justifyContent: "center",
        }}
      >
        {/* Choose New Player Button */}
        <button
          onClick={handleChoosePlayer}
          style={{
            flex: 1,
            maxWidth: "400px",
            height: "250px",
            backgroundColor: "#6b6b6b",
            border: "4px solid #000",
            borderRadius: "10px",
            color: "white",
            fontSize: "32px",
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
            height: "250px",
            backgroundColor: "#6b6b6b",
            border: "4px solid #000",
            borderRadius: "10px",
            color: "white",
            fontSize: "32px",
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
