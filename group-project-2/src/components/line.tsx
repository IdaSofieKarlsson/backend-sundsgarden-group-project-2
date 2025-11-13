import React, { useEffect, useRef, useState } from "react";
import * as Chart from "chart.js";

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
  const [selectedGame, setSelectedGame] = useState<string>("");

  const [chartData, setChartData] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/sessions/user-activity"
        );
        if (!response.ok) throw new Error("Failed to fetch user activity data");
        const data: GameData[] = await response.json();
        setChartData(data);
        // Set first game as default if available
        if (data.length > 0) {
          setSelectedGame(data[0].gameName);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Failed to load user activity data");
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (!ctx) return;

      // Destroy existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Get data for selected game
      const selectedGameData = chartData.find(
        (game) => game.gameName === selectedGame
      );

      // Create datasets for each user
      const datasets =
        selectedGameData?.users.map((user) => ({
          label: user.userName,
          data: user.dailyData.map((d) => d.minutes),
          borderColor: user.color || "#808080",
          backgroundColor: "transparent",
          borderWidth: 4,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: user.color || "#808080",
        })) || [];

      // Create new chart
      chartInstanceRef.current = new Chart.Chart(ctx, {
        type: "line",
        data: {
          labels: ["1", "2", "3", "4", "5", "6", "7"],
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Minutes played per user/day",
              font: {
                size: 12,
                weight: "bold",
                family: "Arial, sans-serif",
              },
              padding: {
                top: 5,
                bottom: 15,
              },
              color: "#000",
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: function (context: any) {
                  return `${context.dataset.label}: ${context.parsed.y} minutes`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: false,
              },
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 10,
                },
                color: "#000",
              },
            },
            y: {
              title: {
                display: false,
              },
              min: 0,
              grid: {
                display: true,
                color: "#e0e0e0",
              },
              ticks: {
                font: {
                  size: 10,
                },
                color: "#000",
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [selectedGame, chartData]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
          fontSize: "18px",
        }}
      >
        Loading user activity data...
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
          minHeight: "500px",
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
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "#e8e8e8",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {/* Chart Section */}
        <div style={{ position: "relative", height: "300px", width: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              zIndex: 10,
            }}
          >
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              style={{
                padding: "6px 20px 6px 10px",
                fontSize: "12px",
                fontWeight: "bold",
                border: "2px solid #000",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
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
