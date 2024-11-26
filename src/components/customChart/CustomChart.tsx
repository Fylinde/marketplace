import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import Box from "components/Box";
import Button from "components/buttons/Button";

// Define the type for chart data
interface ChartDataPoint {
  name: string; // e.g., "January"
  [key: string]: number | string; // Dynamic keys for datasets
}

// Props for the CustomChart component
interface CustomChartProps {
  data: ChartDataPoint[]; // Data to plot
  dataKeys: string[]; // Keys for datasets
  colors?: string[]; // Colors for the datasets
  xAxisKey?: string; // Key for x-axis
  title?: string; // Title of the chart
}

// Explicitly declare `CustomChart` as a functional component with `CustomChartProps`
const CustomChart: React.FC<CustomChartProps> = ({
  data,
  dataKeys,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"],
  xAxisKey = "name",
  title,
}) => {
  const [activeDataKeys, setActiveDataKeys] = useState<string[]>(dataKeys);
  const [zoomStart, setZoomStart] = useState<number>(0);
  const [zoomEnd, setZoomEnd] = useState<number>(data.length - 1);

  const toggleDataKey = (key: string) => {
    setActiveDataKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const resetZoom = () => {
    setZoomStart(0);
    setZoomEnd(data.length - 1);
  };

  const handleBrushChange = (startIndex: number, endIndex: number) => {
    setZoomStart(startIndex);
    setZoomEnd(endIndex);
  };

  const filteredData = data.slice(zoomStart, zoomEnd + 1);

  return (
    <Box>
      {title && <h3 style={{ textAlign: "center", marginBottom: "20px" }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend
            onClick={(e) => toggleDataKey(e.dataKey)}
            wrapperStyle={{ cursor: "pointer" }}
          />
          {activeDataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          ))}
          <Brush
            dataKey={xAxisKey}
            height={30}
            stroke="#8884d8"
            onChange={({ startIndex, endIndex }) => handleBrushChange(startIndex, endIndex)}
          />
        </LineChart>
      </ResponsiveContainer>
      <Box display="flex" justifyContent="center" mt="20px">
        <Button onClick={resetZoom}>Reset Zoom</Button>
      </Box>
    </Box>
  );
};

export default CustomChart;
