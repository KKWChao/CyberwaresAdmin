import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const url = process.env.SERVER_URL + "?chart=bar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart() {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const dummyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: "Weekly Sales",
        padding: {
          top: 20,
          bottom: 20,
        },
        font: {
          size: 24,
        },
      },
    },
  };

  useEffect(() => {
    setChartData({
      labels: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
      datasets: [
        {
          label: "Daily Sales",
          data: [1234, 2345, 3215, 1123, 4122, 3241, 2241],
          borderColor: "rgb(127, 17, 224)",
          backgroundColor: "rgba(114, 99, 248, 0.6)",
        },
      ],
    });
  }, []);
  return <Bar data={chartData} options={dummyOptions} className="p-2" />;
}
