import React, { useEffect, useState } from "react";
import gameLogo from "../assets/game.png";
import { useLocation, useNavigate } from "react-router-dom";
// import API_BASE_URL from "../api";

interface Game {
  _id: string;
  title: string;
  image: string;
}

const GameTimerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { game } = location.state as { game: Game };

  const [running, setRunning] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const userId = "6902160838611259d1c9d5b9"; // placeholder test user id

  useEffect(() => {
    let interval: number | undefined;
    if (running) {
      interval = window.setInterval(() => {
        setMinutes((prev) => {
          if (prev === 59) {
            setHours((h) => h + 1);
            return 0;
          }
          return prev + 1;
        });
      }, 1000); // 1 second = 1 minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running]);

  // Helper to get current ISO string
  const getNow = () => new Date().toISOString();

  // Create session on start, update on stop
  const handleStartStop = async () => {
    if (!running) {
      // Start: create session
      try {
        const res = await fetch(`http://localhost:3001/api/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            gameId: game._id,
            startTime: getNow(),
          }),
        });
        if (!res.ok) throw new Error("Failed to create session");
        const data = await res.json();
        setSessionId(data._id);
        setRunning(true);
      } catch (err) {
        alert("Could not start session: " + (err as Error).message);
      }
    } else {
      // Stop: update session
      if (!sessionId) return alert("No session to update");
      try {
        const duration = hours * 60 + minutes;
        const res = await fetch(
          `http://localhost:3001/api/sessions/${sessionId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endTime: getNow(),
              duration,
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to update session");
        setRunning(false);
        // Optionally: navigate or show a message
      } catch (err) {
        alert("Could not stop session: " + (err as Error).message);
      }
    }
  };
  const handleExit = () => navigate("/games");

  return (
    <div className="game-timer-container">
      <h2 className="game-timer-title">{game.title}</h2>
      <img
        className="game-timer-img"
        src={game.image || gameLogo}
        alt={game.title}
      />
      <div className="stopwatch">
        <span className="stopwatch-time">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
        </span>
      </div>
      <button onClick={handleStartStop} className="start-stop-btn">
        {running ? "Stop" : "Start"}
      </button>
      <button onClick={handleExit} className="exit-btn" disabled={running}>
        Exit
      </button>
    </div>
  );
};

export default GameTimerPage;
