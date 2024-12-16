import React from "react";

// Define the structure of chart data points
interface ChartDataPoint {
  name: string; // E.g., "Campaign Name"
  [key: string]: number | string; // Flexible keys for multiple datasets
}

// Define the props for the Chart component
interface ChartProps {
  data: ChartDataPoint[]; // Array of data points to render
  dataKeys: { name: string; value: string }; // Keys for labels and numerical data
  chartType: "pie" | "bar" | "table"; // Include "table" as a valid chart type
  title?: string; // Optional title for the chart
}


const Chart: React.FC<ChartProps> = ({ data, dataKeys, chartType, title }) => {
  return (
    <div>
      {title && <h2>{title}</h2>}

      {/* Pie Chart Rendering */}
      {chartType === "pie" && (
        <div>
          <p>Rendering Pie Chart with {data.length} data points:</p>
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                {item.name}: {item.value}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bar Chart Placeholder */}
      {chartType === "bar" && (
        <div>
          <p>Rendering Bar Chart with {data.length} data points:</p>
          <p>(Bar chart rendering logic goes here.)</p>
        </div>
      )}

     {chartType === "table" && (
        <table>
          <thead>
            <tr>
              <th>{dataKeys.name}</th>
              <th>{dataKeys.value}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item[dataKeys.name]}</td>
                <td>{item[dataKeys.value]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Chart;
