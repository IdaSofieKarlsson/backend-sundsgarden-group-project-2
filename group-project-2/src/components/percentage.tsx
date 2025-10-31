import React, { useState } from 'react'; // add useEffect if backend code is in use

interface Game {
  id: number;
  name: string;
  progress: number;
}

const GameProgressList: React.FC = () => { 
  const [games, _] = useState<Game[]>([ // add setGames for backend code is in use
    { id: 1, name: 'Game 1', progress: 30 },
    { id: 2, name: 'Game 2', progress: 20 },
    { id: 3, name: 'Game 3', progress: 35 },
    { id: 4, name: 'Game 4', progress: 15 }
  ]);

  // Backend connection - uncomment and modify when ready
  /*
  useEffect(() => {
    const fetchGameData = async (): Promise<void> => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT/games');
        const data: Game[] = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchGameData();
  }, []);
  */

  // Function to get color based on progress
  const getProgressColor = (progress: number): string => {
    if (progress >= 50) return '#4a5568'; // Dark gray for high progress
    if (progress >= 30) return '#718096'; // Medium gray
    return '#a0aec0'; // Light gray for low progress
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f7fafc'
    }}>
      <div style={{
        backgroundColor: '#e2e8f0',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '800px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {games.map((game: Game, index: number) => (
          <div key={game.id}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '25px 0'
            }}>
              {/* Game Icon */}
              <div style={{
                fontSize: '48px',
                marginRight: '30px'
              }}>
                👾
              </div>

              {/* Game Name */}
              <div style={{
                flex: 1,
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                color: '#000'
              }}>
                {game.name}
              </div>

              {/* Progress Circle */}
              <div style={{
                position: 'relative',
                width: '100px',
                height: '100px'
              }}>
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#cbd5e0"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={getProgressColor(game.progress)}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - game.progress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Percentage text */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  fontFamily: 'Arial, sans-serif',
                  color: '#000'
                }}>
                  {game.progress}%
                </div>
              </div>
            </div>

            {/* Divider line */}
            {index < games.length - 1 && (
              <div style={{
                height: '2px',
                backgroundColor: '#000',
                margin: '0'
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameProgressList;
