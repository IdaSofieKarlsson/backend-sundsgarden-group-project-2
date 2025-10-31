import React, { useEffect, useRef, useState } from 'react';
import * as Chart from 'chart.js';

// TypeScript interface
interface GameMinutes {
  gameName: string;
  minutes: number;
}

const MinutesPerGameChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart.Chart | null>(null);
  
  const [gameData, _setGameData] = useState<GameMinutes[]>([
    { gameName: 'Game 1', minutes: 40 },
    { gameName: 'Game 2', minutes: 53 },
    { gameName: 'Game 3', minutes: 26 },
    { gameName: 'Game 4', minutes: 45 }
  ]);

  // Fetch data from backend - uncomment when ready
  /*
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch('/api/game-minutes');
        const data: GameMinutes[] = await response.json();
        setGameData(data);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchGameData();
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

      // Find max value for scaling
      const maxMinutes = Math.max(...gameData.map(g => g.minutes));

      // Create new chart
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
          labels: gameData.map(g => g.gameName),
          datasets: [{
            label: 'Minutes',
            data: gameData.map(g => g.minutes),
            backgroundColor: '#c0c0c0',
            borderColor: '#000000',
            borderWidth: 3,
            barThickness: 60
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          },
          scales: {
            x: {
              display: false,
              max: maxMinutes * 1.5
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 28,
                  weight: 'bold',
                  family: 'Arial, sans-serif'
                },
                color: '#000000',
                padding: 20
              }
            }
          },
          layout: {
            padding: {
              left: 20,
              right: 0,
              top: 0,
              bottom: 0
            }
          }
        },
        plugins: [{
          id: 'customLabels',
          afterDatasetsDraw(chart: any) {
            const { ctx, data, scales } = chart;
            
            ctx.save();
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000000';

            data.datasets[0].data.forEach((value: number, index: number) => {
              const y = scales.y.getPixelForValue(index);
              const barWidth = scales.x.getPixelForValue(value) - scales.x.getPixelForValue(0);
              
              // Draw minutes text in the white part of the bar
              const textX = scales.x.left + barWidth + 100;
              ctx.fillText(`${value} min`, textX, y);
            });

            ctx.restore();
          }
        }]
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [gameData]);

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
        backgroundColor: '#d9d9d9',
        padding: '60px 80px',
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <div style={{ 
          position: 'relative', 
          height: '400px',
          width: '100%'
        }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default MinutesPerGameChart;