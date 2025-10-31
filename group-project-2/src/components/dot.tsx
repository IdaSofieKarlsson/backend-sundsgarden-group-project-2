import React, { useEffect, useRef, useState } from 'react';
import * as Chart from 'chart.js';

// TypeScript interfaces
interface GameData {
  times: number;
  timeMinutes: number;
  userName?: string;
}

interface ChartData {
  gameName: string;
  data: GameData[];
}

const GameScatterChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart.Chart | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>('Game 1');
  const [chartData, _setChartData] = useState<ChartData[]>([ //möjligtvis använder setChartData senare i koden
    {
      gameName: 'Game 1',
      data: [
        { times: 2, timeMinutes: 34, userName: 'User 1' },
        { times: 3, timeMinutes: 17, userName: 'User 2' },
        { times: 2, timeMinutes: 21, userName: 'User 3' },
        { times: 3, timeMinutes: 30, userName: 'User 4' },
        { times: 4, timeMinutes: 30, userName: 'User 5' },
        { times: 5, timeMinutes: 43, userName: 'User 6' },
        { times: 6, timeMinutes: 26, userName: 'User 7' },
        { times: 5, timeMinutes: 37, userName: 'User 8' },
      ]
    },
    {
      gameName: 'Game 2',
      data: [
        { times: 3, timeMinutes: 25, userName: 'User 1' },
        { times: 4, timeMinutes: 35, userName: 'User 2' },
        { times: 5, timeMinutes: 45, userName: 'User 3' },
        { times: 11, timeMinutes: 17, userName: 'User 4'}
      ]
    },
    {
      gameName: 'Game 3',
      data: [
        { times: 2, timeMinutes: 15, userName: 'User 1' },
        { times: 6, timeMinutes: 40, userName: 'User 2' }
      ]
    },
    {
        gameName: 'Game 4',
        data: [
            { times: 2, timeMinutes:17, userName: 'User 5'},
            { times: 6, timeMinutes: 40, userName: 'User 6' },
            { times: 5, timeMinutes: 31, userName: 'User 7' },
            { times: 2, timeMinutes: 12, userName: 'User 8' }
        ]
    }
  ]);

  // Fetch data from backend - uncomment when ready
  /*
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/game-stats');
        const data: ChartData[] = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);
  */

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (!ctx) return;

      // Destroy existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Get data for selected game
      const selectedGameData = chartData.find(game => game.gameName === selectedGame);
      const scatterData = selectedGameData?.data.map(point => ({
        x: point.times,
        y: point.timeMinutes
      })) || [];

      // Create new chart
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: selectedGame,
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
                  const gameData = selectedGameData?.data[dataIndex];
                  return [
                    `Times: ${context.parsed.x}`,
                    `Minutes: ${context.parsed.y}`,
                    gameData?.userName ? `User: ${gameData.userName}` : ''
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
                text: 'Times',
                font: {
                  size: 18,
                  weight: 'bold'
                }
              },
              min: 0,
              max: 8,
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
                text: 'Time (minutes)',
                font: {
                  size: 18,
                  weight: 'bold'
                }
              },
              min: 0,
              max: 65,
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
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [selectedGame, chartData]);

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
        {/* Chart Section */}
        <div style={{ flex: '1', position: 'relative', height: '500px' }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10
          }}>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
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
              {chartData.map((game) => (
                <option key={game.gameName} value={game.gameName}>
                  {game.gameName}
                </option>
              ))}
            </select>
          </div>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};


export default GameScatterChart;