import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  fetchRecommendedCourses,
  fetchEnrolledCourses,
  enrollInCourse,
  fetchCourseDetails,
} from "../../../redux/slices/dashboard/trainingSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"; // Required imports for charts
import type { AppDispatch, RootState } from "../../../redux/store";

// Styled Components
const Container = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Widget = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 1rem;
      margin-bottom: 10px;
      cursor: pointer;

      &:hover {
        color: #007bff;
      }
    }
  }
`;

const CourseDetails = styled.div`
  margin-top: 20px;

  h3 {
    font-size: 1.25rem;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 10px;
  }
`;

const EnrollButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChartContainer = styled.div`
  height: 200px;
  width: 100%;
`;

// TrainingPortal Component
const TrainingPortal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    recommendedCourses,
    enrolledCourses,
    courseDetails,
    loading,
    error,
  } = useSelector((state: RootState) => state.training);

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Fetch recommended and enrolled courses on mount
  useEffect(() => {
    dispatch(fetchRecommendedCourses());
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  const handleCourseSelection = (courseId: number) => {
    setSelectedCourseId(courseId);
    dispatch(fetchCourseDetails(courseId));
  };

  const handleEnroll = (courseId: number) => {
    dispatch(enrollInCourse(courseId));
  };

  if (loading) {
    return <p>{getLocalizedText("loading", "training")}</p>;
  }

  if (error) {
    return <p>{getLocalizedText("errorFetchingData", "training", { error })}</p>;
  }

  return (
    <Container>
      {/* Recommended Courses Widget */}
      <Widget>
        <h2>{getLocalizedText("recommendedCourses", "training")}</h2>
        <ul>
          {recommendedCourses.map((course) => (
            <li key={course.id} onClick={() => handleCourseSelection(course.id)}>
              {course.title} ({getLocalizedText("progress", "training")}: {course.progress}%)
            </li>
          ))}
        </ul>
      </Widget>

      {/* Enrolled Courses Widget */}
      <Widget>
        <h2>{getLocalizedText("enrolledCourses", "training")}</h2>
        <ul>
          {enrolledCourses.map((course) => (
            <li key={course.id} onClick={() => handleCourseSelection(course.id)}>
              {course.title} ({getLocalizedText("progress", "training")}: {course.progress}%)
            </li>
          ))}
        </ul>
      </Widget>

      {/* Course Details Widget */}
      {selectedCourseId && courseDetails && (
        <Widget>
          <h2>{courseDetails.title}</h2>
          <CourseDetails>
            {courseDetails.content.map((lesson: string, index: number) => (
              <p key={index}>{lesson}</p>
            ))}
          </CourseDetails>
          <h3>{getLocalizedText("quiz", "training")}</h3>
          <ul>
            {courseDetails.quizzes.map((quiz: any, index: number) => (
              <li key={index}>{quiz.question}</li>
            ))}
          </ul>
          {!enrolledCourses.some((course) => course.id === selectedCourseId) && (
            <EnrollButton onClick={() => handleEnroll(selectedCourseId)}>
              {getLocalizedText("enroll", "training")}
            </EnrollButton>
          )}
        </Widget>
      )}

      {/* Training Progress Chart Widget */}
      <Widget>
        <h2>{getLocalizedText("trainingProgress", "training")}</h2>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: getLocalizedText("completed", "training"), value: 70 },
                  { name: getLocalizedText("inProgress", "training"), value: 20 },
                  { name: getLocalizedText("notStarted", "training"), value: 10 },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                <Cell fill="#28a745" />
                <Cell fill="#ffc107" />
                <Cell fill="#dc3545" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Widget>
    </Container>
  );
};

export default TrainingPortal;
