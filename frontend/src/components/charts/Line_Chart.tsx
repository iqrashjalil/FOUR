// Import dependencies
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { salesDataInfo } from "@/types/types";

// Register the required components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LineChart = ({ salesData }: salesDataInfo) => {
  // Chart data
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Sales",
        data: salesData,
        borderColor: "#ff3131",
        backgroundColor: "#ff3131",
        tension: 0.4, // Makes the line curved
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Use a valid value
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };

  return <Line className="h-[30vh] w-60" data={data} options={options} />;
};

export default LineChart;
