import React from "react";
import { useAppSelector } from "../redux/reduxHooks";
import Box from "components/Box";

const AnalyticsDashboard: React.FC = () => {
  const { chatbotResolved, humanResolved } = useAppSelector((state) => state.analytics);

  const total = chatbotResolved + humanResolved;
  const chatbotPercentage = total ? ((chatbotResolved / total) * 100).toFixed(2) : 0;
  const humanPercentage = total ? ((humanResolved / total) * 100).toFixed(2) : 0;

  return (
    <Box>
      <h2>Chatbot Effectiveness</h2>
      <p><strong>Chatbot Resolutions:</strong> {chatbotResolved} ({chatbotPercentage}%)</p>
      <p><strong>Human Resolutions:</strong> {humanResolved} ({humanPercentage}%)</p>
    </Box>
  );
};

export default AnalyticsDashboard;
