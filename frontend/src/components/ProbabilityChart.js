import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ProbabilityChart = ({ probabilities }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null); // Track the chart instance

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy existing chart before re-creating
    }

    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Low Risk", "High Risk"],
        datasets: [
          {
            label: "Sepsis Probability",
            data: probabilities,
            backgroundColor: ["#4caf50", "#f44336"], // Green & Red
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
          },
        },
      },
    });

    // Optional: cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [probabilities]);

  return <canvas ref={canvasRef} id="probabilityChart" />;
};

export default ProbabilityChart;
