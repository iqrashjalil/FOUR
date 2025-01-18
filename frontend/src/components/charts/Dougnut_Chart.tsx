import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { DoughnutChartInfo } from "@/types/types";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dougnut_Chart: React.FC<DoughnutChartInfo> = ({ data }) => {
  // Prepare the data for the Doughnut Chart
  const chartData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: data,
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Doughnut className="w-60" data={chartData} options={options} />;
};

export default Dougnut_Chart;
