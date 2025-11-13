import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { ChartConfiguration } from "chart.js";
Chart.register(...registerables);

interface HorizontalBarChartProps {
  userId: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ userId }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/sessions/user-overview/${userId}`
        );
        const data = await response.json();
        console.log("Fetched playtime data:", data);

        if (chartInstanceRef.current) {
          // Uppdatera chart med ny data
          chartInstanceRef.current.data.labels = data.length
            ? data.map((d: any) => d._id)
            : ["No data"];
          chartInstanceRef.current.data.datasets[0].data = data.length
            ? data.map((d: any) => d.totalMinutes)
            : [0];
          chartInstanceRef.current.update();
        }
      } catch (error) {
        console.error("Error fetching playtime data:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const config: ChartConfiguration<"bar", number[], string> = {
      type: "bar",
      data: {
        labels: ["Game 1", "Game 2", "Game 3", "Game 4"],
        datasets: [
          {
            label: "Minutes Played",
            data: [],
            backgroundColor: ["#e0e0e0", "#9e9e9e", "#e0e0e0", "#9e9e9e"],
            borderColor: "#000000",
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Minutes played per game",
            font: { size: 18, family: "Arial, sans-serif" },
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
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default HorizontalBarChart;

