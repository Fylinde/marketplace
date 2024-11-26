import React, { useRef } from "react";
import CustomChart  from "../customChart/CustomChart";
import Box from "components/Box";
import Button from "components/buttons/Button";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Define the type for chart data
interface ChartDataPoint {
  name: string; // e.g., "January"
  [key: string]: number | string; // Dynamic keys for datasets
}

// Define props for Chart
interface ChartProps {
    data: ChartDataPoint[]; // Data to render in the chart
    dataKeys: string[]; // Keys for numerical data
    title?: string; // Optional title
  }

// Example data
const data: ChartDataPoint[] = [
  { name: "January", Impressions: 4000, Clicks: 2400, Conversions: 240 },
  { name: "February", Impressions: 3000, Clicks: 1398, Conversions: 221 },
  { name: "March", Impressions: 2000, Clicks: 9800, Conversions: 229 },
  { name: "April", Impressions: 2780, Clicks: 3908, Conversions: 200 },
  { name: "May", Impressions: 1890, Clicks: 4800, Conversions: 218 },
  { name: "June", Impressions: 2390, Clicks: 3800, Conversions: 250 },
  { name: "July", Impressions: 3490, Clicks: 4300, Conversions: 210 },
];

const Chart: React.FC<ChartProps> = ({ data, dataKeys, title }) => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  const exportAsImage = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) saveAs(blob, `chart.png`);
        });
      });
    }
  };

  const exportAsPDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
        pdf.save(`chart.pdf`);
      });
    }
  };

  return (
    <Box>
      <h1>Advanced Chart with Zoom and Export</h1>
      <Box ref={chartRef}>
        <CustomChart
          data={data} // Correctly passing the data array
          dataKeys={["Impressions", "Clicks", "Conversions"]} // Correctly passing keys
          title="Campaign Performance" // Optional title
        />
      </Box>
      <Box display="flex" justifyContent="center" gap="10px" mt="10px">
        <Button onClick={exportAsImage}>Export as Image</Button>
        <Button onClick={exportAsPDF}>Export as PDF</Button>
      </Box>
    </Box>
  );
};

export default Chart;
