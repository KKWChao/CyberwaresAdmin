import { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart() {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const dummyOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    setChartData({
      responsive: true,
      maintainAspectRatio: false,

      labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
      datasets: [
        {
          label: "# of Purhcases",
          data: [12, 19, 3, 5],
          backgroundColor: [
            "rgba(255, 99, 132, 0.4)",
            "rgba(54, 162, 235, 0.4)",
            "rgba(255, 206, 86, 0.4)",
            "rgba(75, 192, 192, 0.4)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, []);
  return <Doughnut data={chartData} options={dummyOptions} />;
}
