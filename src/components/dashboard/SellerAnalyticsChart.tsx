import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions, TooltipItem } from "chart.js";
import { colors } from "../../utils/themeColors";

const datasetOptions = {
  fill: true,
  borderWidth: 1,
  backgroundColor: colors.primary.light,
  borderColor: colors.primary.main,
  pointRadius: 2,
  pointBorderWidth: 4,
};

// Corrected chart options for Chart.js v3+ or v4+
const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // Moved under `plugins`
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        title: () => "",
        label: (tooltipItem: TooltipItem<"line">) => {
          let label = tooltipItem.label || "";

          if (label) {
            label += " - ";
          }

          return `${label}$${Math.round(tooltipItem.raw as number * 100) / 100}`;
        },
      },
    },
  },
  scales: {
    x: {
      type: "linear", // Corrected type for x-axis
      display: false,
    },
    y: {
      type: "linear", // Corrected type for y-axis
      display: false,
      ticks: {
        beginAtZero: true, // Correct placement for ticks
      } as any, // Bypass TypeScript type checking for the ticks object
    },
  },
};

const VendorAnalyticsChart = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    // Create label for 30 days (dummy date)
    let labelList = new Array(30).fill("").map((_item, ind) => {
      let date = new Date();
      date.setDate(ind + 1);
      return format(date, "MMM dd");
    });

    setData({
      labels: labelList,
      datasets: [
        {
          data: datasetData,
          ...datasetOptions,
        },
      ],
    });
  }, []);

  return <Line data={data} options={options} />;
};

const datasetData = [
  10, 7, 4, 15, 12, 17, 13, 25, 22, 19, 30, 25, 22, 29, 40, 37, 47, 43, 59, 60, 55, 62, 69, 43, 59, 60, 75, 62, 75, 80,
];

export default VendorAnalyticsChart;
