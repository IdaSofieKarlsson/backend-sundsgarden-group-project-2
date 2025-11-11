import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import ActiveUserDisplay from "../components/ActiveUserDisplay";
import UserSelectionPanel from "../components/UserSelectionPanel";
import gameLogo from "../assets/game.png";
import "../styles/GamePage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
// import API_BASE_URL from "../api";

interface Game {
  _id: string;
  title: string;
  image: string;
}

const GamePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();
  const { activeUser } = useUser();

  useEffect(() => {
    fetch(`http://localhost:3001/api/games`)
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  return (
    <div className="game-page-container" style={{ position: "relative" }}>
      <h1 className="game-page-title">Choose a game and a user to play</h1>
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
        disabled={!selectedGame || !activeUser}
        onClick={() => {
          if (selectedGame && activeUser) {
            const game = games.find((g) => g._id === selectedGame);
            if (game) {
              navigate("/games/timer", { state: { game } });
            }
          } else if (!activeUser) {
            alert("Please select a player first");
          }
        }}
      >
        Play
      </button>

      <UserSelectionPanel />
      <ActiveUserDisplay activeUser={activeUser} />
    </div>
  );
};

export default GamePage;
