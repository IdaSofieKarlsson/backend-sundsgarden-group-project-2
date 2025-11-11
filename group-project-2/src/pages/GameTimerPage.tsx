import React, { useEffect, useState } from "react";
import gameLogo from "../assets/game.png";
import ActiveUserDisplay from "../components/ActiveUserDisplay";
import "../styles/GameTimerPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
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
  const { activeUser } = useUser();

  const [running, setRunning] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartMinutes, setSessionStartMinutes] = useState(0);
  const userId = activeUser?._id || "6902160838611259d1c9d5b9"; // Use active user or fallback to test user

  useEffect(() => {
    if (activeUser && game && !sessionId) {
      const startSession = async () => {
        try {
          const res = await fetch(
            `http://localhost:3001/api/sessions/get-or-create`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: activeUser._id,
                gameId: game._id,
              }),
            }
          );
          if (!res.ok) throw new Error("Failed to get or create session");
          const data = await res.json();
          setSessionId(data._id);

          // Load if session already exists
          if (data.duration) {
            const existingMinutes = data.duration;
            setHours(Math.floor(existingMinutes / 60));
            setMinutes(existingMinutes % 60);
            // Track the starting point for this session
            setSessionStartMinutes(existingMinutes);
          } else {
            // New session, start from 0
            setSessionStartMinutes(0);
          }

          setRunning(true);
        } catch (err) {
          console.error("Could not start session:", err);
          alert("Could not start session: " + (err as Error).message);
        }
      };
      startSession();
    }
  }, []);

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

  // Create/reuse session on start, update on stop
  const handleStartStop = async () => {
    if (!running) {
      // Get or create session
      try {
        const res = await fetch(
          `http://localhost:3001/api/sessions/get-or-create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              gameId: game._id,
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to get or create session");
        const data = await res.json();
        setSessionId(data._id);

        // Load if session already exists
        if (data.duration) {
          const existingMinutes = data.duration;
          setHours(Math.floor(existingMinutes / 60));
          setMinutes(existingMinutes % 60);
          // Track the starting point for this session
          setSessionStartMinutes(existingMinutes);
        } else {
          // New session, start from 0
          setSessionStartMinutes(0);
        }

        setRunning(true);
      } catch (err) {
        alert("Could not start session: " + (err as Error).message);
      }
    } else {
      // Update session with time played in this session
      if (!sessionId) return alert("No session to update");
      try {
        const currentTotalMinutes = hours * 60 + minutes;
        const sessionDuration = currentTotalMinutes - sessionStartMinutes;

        const res = await fetch(
          `http://localhost:3001/api/sessions/${sessionId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endTime: getNow(),
              duration: sessionDuration,
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to update session");
        setRunning(false);
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
        <div className="stopwatch-time">
          <span className="time-value">{String(hours).padStart(2, "0")}</span>
          <span className="time-label">hours</span>
          <span className="time-value">{String(minutes).padStart(2, "0")}</span>
          <span className="time-label">minutes</span>
        </div>
      </div>
      <button onClick={handleStartStop} className="start-stop-btn">
        {running ? "Stop" : "Start"}
      </button>
      <button onClick={handleExit} className="exit-btn" disabled={running}>
        Exit
      </button>

      <ActiveUserDisplay activeUser={activeUser} />
    </div>
  );
};

export default GameTimerPage;
