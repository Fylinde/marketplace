import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  fetchSustainabilityMetrics,
  fetchSustainabilityAchievements,
  submitSustainabilityGoal,
} from "../../../redux/slices/analytics/sustainabilitySlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { AppDispatch, RootState } from "../../../redux/store";

// Styled Components
const Container = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
`;

const Widget = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  ul {
    padding: 0;
    list-style: none;

    li {
      font-size: 1rem;
      margin-bottom: 10px;

      @media (max-width: 480px) {
        font-size: 0.9rem;
      }
    }
  }
`;

const ChartContainer = styled.div`
  height: 200px;
  width: 100%;
`;

const GoalInput = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

// Sustainability Metrics Component
const SustainabilityMetrics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { metrics, achievements, loading, error } = useSelector(
    (state: RootState) => state.sustainability
  );

  const [goal, setGoal] = useState("");
  const [goalValue, setGoalValue] = useState<number | "">("");

  useEffect(() => {
    dispatch(fetchSustainabilityMetrics());
    dispatch(fetchSustainabilityAchievements());
  }, [dispatch]);

  const handleGoalSubmit = () => {
    if (!goal || !goalValue) {
      alert(getLocalizedText("goalError", "sustainability"));
      return;
    }
    dispatch(submitSustainabilityGoal({ goal, value: Number(goalValue) }));
    setGoal("");
    setGoalValue("");
  };

  if (loading) {
    return <p>{getLocalizedText("loading", "sustainability")}</p>;
  }

  if (error) {
    return <p>{getLocalizedText("errorFetchingMetrics", "sustainability", { error })}</p>;
  }

  return (
    <Container>
      {/* Emissions Widget */}
      <Widget>
        <h2>{getLocalizedText("carbonEmissions", "sustainability")}</h2>
        <p>
          {getLocalizedText("currentEmissions", "sustainability")}: {metrics.emissions} kg CO2
        </p>
      </Widget>

      {/* Eco Products Widget */}
      <Widget>
        <h2>{getLocalizedText("ecoProducts", "sustainability")}</h2>
        <p>
          {getLocalizedText("productsMarkedEco", "sustainability")}: {metrics.ecoProducts}
        </p>
      </Widget>

      {/* Recyclable Packaging Widget */}
      <Widget>
        <h2>{getLocalizedText("recyclablePackaging", "sustainability")}</h2>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: getLocalizedText("recyclable", "sustainability"),
                    value: metrics.recyclablePackaging,
                  },
                  {
                    name: getLocalizedText("nonRecyclable", "sustainability"),
                    value: 100 - metrics.recyclablePackaging,
                  },
                ]}
                dataKey="value"
                outerRadius={80}
              >
                <Cell fill="#28a745" />
                <Cell fill="#dc3545" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p>
          {metrics.recyclablePackaging}% {getLocalizedText("recyclablePackaging", "sustainability")}
        </p>
      </Widget>

      {/* Offset Contributions Widget */}
      <Widget>
        <h2>{getLocalizedText("offsetContributions", "sustainability")}</h2>
        <p>
          {getLocalizedText("contributionsMade", "sustainability")}: $
          {metrics.offsetContributions}
        </p>
      </Widget>

      {/* Achievements Widget */}
      <Widget>
        <h2>{getLocalizedText("achievements", "sustainability")}</h2>
        <ul>
          {achievements.map((achievement: string, idx: number) => (
            <li key={idx}>{achievement}</li>
          ))}
        </ul>
      </Widget>

      {/* Submit Goal Widget */}
      <Widget>
        <h2>{getLocalizedText("submitGoal", "sustainability")}</h2>
        <GoalInput>
          <input
            type="text"
            placeholder={getLocalizedText("goalDescription", "sustainability")}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <input
            type="number"
            placeholder={getLocalizedText("goalValue", "sustainability")}
            value={goalValue === "" ? "" : goalValue}
            onChange={(e) => setGoalValue(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
          />
          <button onClick={handleGoalSubmit}>{getLocalizedText("submit", "common")}</button>
        </GoalInput>
      </Widget>
    </Container>
  );
};

export default SustainabilityMetrics;