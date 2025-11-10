import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import type { ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

interface GameData{
  _id:string;
  title: string;
  minutes: number;
}

const HorizontalBarChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [gameData, setGameData] = useState<GameData[]>([]);

  // --- Fetch data från API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/games");
        const data = await res.json();
        console.log("Fetched game data", data);
        setGameData(data);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    fetchData();
  }, []); // <-- Viktigt: useEffect ska ha en dependency array här

  // --- Rita diagrammet ---
  useEffect(() => {
    if (!gameData.length || !chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Förstör gammalt diagram innan nytt skapas
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: gameData.map((g) => g.title),
        datasets: [
          {
            label: 'Minutes Played',
            data: gameData.map((g) => g.minutes),
            backgroundColor: ['#e0e0e0', '#9e9e9e', '#e0e0e0', '#9e9e9e'],
            borderColor: '#000000',
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Minutes played per game',
            font: { size: 18, family: 'Arial, sans-serif' },
            padding: { top: 10, bottom: 30 },
          },
        },
        scales: { x: { beginAtZero: true }, y: { grid: { display: false } } },
      },
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [gameData]); // <-- lyssna på gameData, inte GameData

  return  <div style={{ width: "100%", height: "400px" }}>
    <canvas ref={chartRef} />
  </div>
};

export default HorizontalBarChart;

