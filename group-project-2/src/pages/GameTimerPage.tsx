import React, { useEffect, useState, useRef } from "react";
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
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartMinutes, setSessionStartMinutes] = useState(0);
  const userId = activeUser?._id || "6902160838611259d1c9d5b9"; // Use active user or fallback to test user
  const hasInitialized = useRef(false);

  // Calculate display values
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  useEffect(() => {
    if (activeUser && game && !sessionId && !hasInitialized.current) {
      hasInitialized.current = true;
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

          console.log("Initial session load:");
          console.log("  Session data:", data);
          console.log("  data.duration:", data.duration);

          // Load if session already exists
          if (data.duration !== undefined && data.duration !== null) {
            const existingMinutes = data.duration;
            console.log("  Loading existing duration:", existingMinutes);
            setTotalMinutes(existingMinutes);
            // Track the starting point for this session
            setSessionStartMinutes(existingMinutes);
          } else {
            console.log("  New session, starting from 0");
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
        setTotalMinutes((prev) => prev + 1);
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
      if (sessionId) {
        setSessionStartMinutes(totalMinutes);
        setRunning(true);
        return;
      }

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
        if (data.duration !== undefined && data.duration !== null) {
          const existingMinutes = data.duration;
          setTotalMinutes(existingMinutes);
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
        const sessionDuration = totalMinutes - sessionStartMinutes;

        console.log("Stopping timer:");
        console.log("  totalMinutes:", totalMinutes);
        console.log("  sessionStartMinutes:", sessionStartMinutes);
        console.log("  sessionDuration (sending to backend):", sessionDuration);

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
        const updatedData = await res.json();
        console.log("Updated session data:", updatedData);
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
