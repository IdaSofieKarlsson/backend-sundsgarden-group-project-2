import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { ChartConfiguration } from "chart.js";

Chart.register(...registerables);

interface HorizontalBarChartProps {
  userId: string;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ userId }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<"bar", number[], string> | null>(null);

  // Initialize chart only once
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration<"bar", number[], string> = {
      type: "bar",
      data: {
        labels: [],
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
      chartInstanceRef.current?.destroy();
    };
  }, []);

  // Fetch data whenever userId changes
  useEffect(() => {
    if (!userId || !chartInstanceRef.current) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/sessions/user-overview/${userId}`
        );
        const data = await response.json();
        console.log("Fetched playtime data:", data);

        if (!isMounted) return;

        const chart = chartInstanceRef.current!;
        chart.data.labels = data.length ? data.map((d: any) => d._id) : ["No data"];
        chart.data.datasets[0].data = data.length
          ? data.map((d: any) => d.totalMinutes)
          : [0];
        chart.update();
      } catch (error) {
        console.error("Error fetching playtime data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return <canvas ref={chartRef}></canvas>;
};

export default HorizontalBarChart;
