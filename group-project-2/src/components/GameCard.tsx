import React from "react";

interface GameCardProps {
  title: string;
  image: string;
  selected: boolean;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  image,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`game-card${selected ? " selected" : ""}`}
    >
      <img src={image} alt={title} className="game-card-img" />
      <div className="game-card-title">{title}</div>
    </div>
  );
};

export default GameCard;
