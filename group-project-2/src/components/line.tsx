import React, { useEffect, useRef, useState } from 'react';
import * as Chart from 'chart.js';

// TypeScript interfaces
interface UserDailyData {
  day: number;
  minutes: number;
}

interface UserData {
  userId: string;
  userName: string;
  dailyData: UserDailyData[];
  color?: string;
}

interface GameData {
  gameName: string;
  users: UserData[];
}

const UserActivityLineChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart.Chart | null>(null);
  const [selectedGame, setSelectedGame] = useState<string>('Game 1');
  
  const [chartData, _setChartData] = useState<GameData[]>([ // add setchartdata if used
    {
      gameName: 'Game 1',
      users: [
        {
          userId: '1',
          userName: 'User 1',
          dailyData: [
            { day: 1, minutes: 10 },
            { day: 2, minutes: 15 },
            { day: 3, minutes: 15 },
            { day: 4, minutes: 20 },
            { day: 5, minutes: 35 },
            { day: 6, minutes: 40 },
            { day: 7, minutes: 30 }
          ],
          color: '#808080'
        },
        {
          userId: '2',
          userName: 'User 2',
          dailyData: [
            { day: 1, minutes: 5 },
            { day: 2, minutes: 10 },
            { day: 3, minutes: 12 },
            { day: 4, minutes: 18 },
            { day: 5, minutes: 25 },
            { day: 6, minutes: 30 },
            { day: 7, minutes: 28 }
          ],
          color: '#a9a9a9'
        },
        {
          userId: '3',
          userName: 'User 3',
          dailyData: [
            { day: 1, minutes: 8 },
            { day: 2, minutes: 12 },
            { day: 3, minutes: 10 },
            { day: 4, minutes: 15 },
            { day: 5, minutes: 22 },
            { day: 6, minutes: 28 },
            { day: 7, minutes: 25 }
          ],
          color: '#c0c0c0'
        }
      ]
    },
    {
      gameName: 'Game 2',
      users: [
        {
          userId: '1',
          userName: 'User 1',
          dailyData: [
            { day: 1, minutes: 15 },
            { day: 2, minutes: 20 },
            { day: 3, minutes: 25 },
            { day: 4, minutes: 30 },
            { day: 5, minutes: 28 },
            { day: 6, minutes: 35 },
            { day: 7, minutes: 40 }
          ],
          color: '#808080'
        }
      ]
    },
    {
      gameName: 'Game 3',
      users: [
        {
          userId: '1',
          userName: 'User 1',
          dailyData: [
            { day: 1, minutes: 5 },
            { day: 2, minutes: 10 },
            { day: 3, minutes: 15 },
            { day: 4, minutes: 12 },
            { day: 5, minutes: 18 },
            { day: 6, minutes: 20 },
            { day: 7, minutes: 22 }
          ],
          color: '#808080'
        }
      ]
    },
    {
      gameName: 'Game 4',
      users: [
        {
          userId: '1',
          userName: 'User 1',
          dailyData: [
            { day: 1, minutes: 12 },
            { day: 2, minutes: 18 },
            { day: 3, minutes: 22 },
            { day: 4, minutes: 25 },
            { day: 5, minutes: 30 },
            { day: 6, minutes: 32 },
            { day: 7, minutes: 35 }
          ],
          color: '#808080'
        }
      ]
    }
  ]);

  // Fetch data from backend - uncomment when ready
  /*
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/user-activity');
        const data: GameData[] = await response.json();
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
      
      // Create datasets for each user
      const datasets = selectedGameData?.users.map(user => ({
        label: user.userName,
        data: user.dailyData.map(d => d.minutes),
        borderColor: user.color || '#808080',
        backgroundColor: 'transparent',
        borderWidth: 4,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: user.color || '#808080'
      })) || [];

      // Create new chart
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: 'line',
        data: {
          labels: ['1', '2', '3', '4', '5', '6', '7'],
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Amount of minutes played per user/day',
              font: {
                size: 20,
                weight: 'bold',
                family: 'Arial, sans-serif'
              },
              padding: {
                top: 10,
                bottom: 30
              },
              color: '#000'
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context: any) {
                  return `${context.dataset.label}: ${context.parsed.y} minutes`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: false
              },
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 14
                },
                color: '#000'
              }
            },
            y: {
              title: {
                display: false
              },
              min: 0,
              grid: {
                display: true,
                color: '#e0e0e0'
              },
              ticks: {
                font: {
                  size: 14
                },
                color: '#000'
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
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
        backgroundColor: '#e8e8e8',
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

export default UserActivityLineChart;