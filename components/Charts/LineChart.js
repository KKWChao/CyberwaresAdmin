import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const options = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export default function LineChart() {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  useEffect(() => {
    setChartData({
      labels,
      datasets: [
        {
          label: "Dataset 1",
          data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
          borderColor: "rgb(114, 99, 248)",
          backgroundColor: "rgba(114, 99, 248, 0.6)",
        },
        {
          label: "Dataset 2",
          data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
          borderColor: "rgb(114, 99, 248)",
          backgroundColor: "rgba(114, 99, 248, 0.6)",
        },
      ],
    });
  }, []);

  return <Line options={options} data={chartData} />;
}
