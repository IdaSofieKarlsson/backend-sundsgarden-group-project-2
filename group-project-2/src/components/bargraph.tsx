import React, { useEffect, useRef, useState } from "react";
import * as Chart from "chart.js";

// TypeScript interface
interface GameMinutes {
  gameName: string;
  minutes: number;
}

const MinutesPerGameChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart.Chart | null>(null);

  const [gameData, setGameData] = useState<GameMinutes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/sessions/minutes-per-game"
        );
        if (!response.ok) throw new Error("Failed to fetch game minutes data");
        const data: GameMinutes[] = await response.json();
        setGameData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game data:", error);
        setError("Failed to load game data");
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (!ctx) return;

      // Destroy existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Find max value for scaling
      const maxMinutes = Math.max(...gameData.map((g) => g.minutes));

      // Create new chart
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: "bar",
        data: {
          labels: gameData.map((g) => g.gameName),
          datasets: [
            {
              label: "Minutes",
              data: gameData.map((g) => g.minutes),
              backgroundColor: "#c0c0c0",
              borderColor: "#000000",
              borderWidth: 2,
              barThickness: 40,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            x: {
              display: false,
              max: maxMinutes * 1.5,
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 16,
                  weight: "bold",
                  family: "Arial, sans-serif",
                },
                color: "#000000",
                padding: 12,
              },
            },
          },
          layout: {
            padding: {
              left: 20,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
        },
        // plugin to show minutes played next to the bars, uncomment if needed
        /*plugins: [
          {
            id: "customLabels",
            afterDatasetsDraw(chart: any) {
              const { ctx, data, scales } = chart;

              ctx.save();
              ctx.font = "bold 16px Arial";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#000000";

              data.datasets[0].data.forEach((value: number, index: number) => {
                const y = scales.y.getPixelForValue(index);
                const barWidth =
                  scales.x.getPixelForValue(value) -
                  scales.x.getPixelForValue(0);

                // Draw minutes text in the white part of the bar
                const textX = scales.x.left + barWidth + 60;
                ctx.fillText(`${value} min`, textX, y);
              });

              ctx.restore();
            },
          },
        ],*/
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [gameData]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          fontSize: "18px",
        }}
      >
        Loading game data...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
          fontSize: "18px",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#d9d9d9",
          padding: "5px 5px",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "300px",
            width: "100%",
          }}
        >
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default MinutesPerGameChart;
