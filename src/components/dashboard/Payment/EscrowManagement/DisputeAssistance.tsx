import React, { useEffect, useState } from "react";

const DisputeAssistance = ({ transactionId }: { transactionId: string }) => {
  const [recommendations, setRecommendations] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/escrow-disputes/${transactionId}/recommendations`);
        if (!response.ok) throw new Error("Failed to fetch recommendations");
        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      }
    };
    fetchRecommendations();
  }, [transactionId]);
  

  return (
    <div>
      <h3>AI-Powered Recommendations</h3>
      {recommendations ? (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      ) : (
        <p>Loading recommendations...</p>
      )}
    </div>
  );
};

export default DisputeAssistance;
