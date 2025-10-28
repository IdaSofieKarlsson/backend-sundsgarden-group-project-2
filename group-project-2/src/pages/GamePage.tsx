import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import gameLogo from "../assets/game.png";
import "../styles/GamePage.css";
import { useNavigate } from "react-router-dom";

interface Game {
  _id: string;
  title: string;
  image: string;
}

const GamePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/games")
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  return (
    <div className="game-page-container">
      <h1 className="game-page-title">Choose a game to play</h1>
      <div className="game-card-list">
        {games.map((game) => (
          <GameCard
            key={game._id}
            title={game.title}
            image={game.image || gameLogo}
            selected={selectedGame === game._id}
            onClick={() => setSelectedGame(game._id)}
          />
        ))}
      </div>
      <button
        className="play-button"
        disabled={!selectedGame}
        onClick={() => {
          if (selectedGame) {
            const game = games.find((g) => g._id === selectedGame);
            if (game) {
              navigate("/games/timer", { state: { game } });
            }
          }
        }}
      >
        Play
      </button>
    </div>
  );
};

export default GamePage;
