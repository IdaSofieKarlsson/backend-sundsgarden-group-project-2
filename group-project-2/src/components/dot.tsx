import React, { useEffect, useRef, useState } from 'react';
import * as Chart from 'chart.js';

interface GameData {
  userId: string;
  times: number;
  timeMinutes: number;
  userName: string;
}

interface Game {
  _id: string;
  title: string;  // Changed to match your API
  image: string;
}

const GameScatterChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart.Chart | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [games, setGames] = useState<Game[]>([]);
  const [chartData, setChartData] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log('Fetching games...');
        const response = await fetch('http://localhost:3001/api/games');
        console.log('Games response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch games');
        
        const data: Game[] = await response.json();
        console.log('Games fetched:', data);
        setGames(data);
        
        if (data.length > 0) {
          console.log('Setting default game:', data[0]._id);
          setSelectedGameId(data[0]._id);
        } else {
          console.warn('No games found');
          setError('No games available');
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games: ' + (err as Error).message);
      }
    };

    fetchGames();
  }, []);

  // Fetch chart data when game selection changes
  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedGameId) {
        console.log('No game selected yet');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching chart data for game:', selectedGameId);
        
        const url = `http://localhost:3001/api/sessions/game-overview/${selectedGameId}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('Chart data response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch chart data: ${response.status} - ${errorText}`);
        }
        
        const data: GameData[] = await response.json();
        console.log('Chart data fetched:', data);
        console.log('Number of users:', data.length);
        
        setChartData(data);
        setLoading(false);
        
        if (data.length === 0) {
          console.warn('No session data for this game');
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data: ' + (err as Error).message);
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedGameId]);

  // Render chart when data changes
  useEffect(() => {
    console.log('Chart render effect triggered');
    console.log('Chart data length:', chartData.length);
    console.log('Chart ref current:', chartRef.current);
    
    if (chartRef.current && chartData.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }

      console.log('Destroying old chart...');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const scatterData = chartData.map(point => ({
        x: point.times,
        y: point.timeMinutes
      }));
      
      console.log('Scatter data:', scatterData);

      const selectedGame = games.find(g => g._id === selectedGameId);
      console.log('Selected game:', selectedGame);

      console.log('Creating new chart...');
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: selectedGame?.title || 'Game',  // Changed to 'title'
            data: scatterData,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const dataIndex = context.dataIndex;
                  const userData = chartData[dataIndex];
                  return [
                    `User: ${userData.userName}`,
                    `Times played: ${userData.times}`,
                    `Avg minutes: ${userData.timeMinutes}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'Times Played',
                font: {
                  size: 18,
                  weight: 'bold'
                }
              },
              min: 0,
              ticks: {
                stepSize: 1,
                font: {
                  size: 14
                }
              },
              grid: {
                display: true,
                color: '#e0e0e0'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Average Time (minutes)',
                font: {
                  size: 18,
                  weight: 'bold'
                }
              },
              min: 0,
              ticks: {
                stepSize: 10,
                font: {
                  size: 14
                }
              },
              grid: {
                display: true,
                color: '#e0e0e0'
              }
            }
          }
        }
      });
      
      console.log('Chart created successfully');
    } else {
      console.log('Cannot render chart - missing data or ref');
    }

    return () => {
      if (chartInstanceRef.current) {
        console.log('Cleaning up chart');
        chartInstanceRef.current.destroy();
      }
    };
  }, [selectedGameId, chartData, games]);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        display: 'flex',
        gap: '30px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
        width: '100%'
      }}>

        <div style={{ flex: '1', position: 'relative', height: '500px' }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10
          }}>
            <select
              value={selectedGameId}
              onChange={(e) => {
                console.log('Game selection changed to:', e.target.value);
                setSelectedGameId(e.target.value);
              }}
              disabled={loading || games.length === 0}
              style={{
                padding: '10px 30px 10px 15px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid #000',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center'
              }}
            >
              {games.length === 0 ? (
                <option>No games available</option>
              ) : (
                games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.title}
                  </option>
                ))
              )}
            </select>
          </div>
          
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}>
              Loading chart data...
            </div>
          ) : chartData.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#666',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <p>No session data available for this game</p>
              <p style={{ fontSize: '14px' }}>Selected game ID: {selectedGameId}</p>
            </div>
          ) : (
            <canvas ref={chartRef}></canvas>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScatterChart;