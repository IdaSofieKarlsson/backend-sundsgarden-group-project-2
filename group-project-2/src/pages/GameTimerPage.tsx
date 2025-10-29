import React, { useEffect, useState } from "react";
import gameLogo from "../assets/game.png";
import { useLocation, useNavigate } from "react-router-dom";

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

  const handleStartStop = () => setRunning((r) => !r);
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
      <button onClick={handleExit} className="exit-btn">
        Exit
      </button>
    </div>
  );
};

export default GameTimerPage;
