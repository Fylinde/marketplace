import axios from "axios";

// Define interfaces for course data
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  enrolled: boolean;
}

interface CourseDetails extends Course {
  syllabus: string[];
  instructor: string;
}

const BASE_URL = "/api/training";

const getRecommendedCourses = async (): Promise<Course[]> => {
  const response = await axios.get<Course[]>(`${BASE_URL}/recommended`);
  return response.data;
};

const getEnrolledCourses = async (): Promise<Course[]> => {
  const response = await axios.get<Course[]>(`${BASE_URL}/enrolled`);
  return response.data;
};

const enrollInCourse = async (courseId: number): Promise<void> => {
  await axios.post(`${BASE_URL}/enroll`, { courseId });
};

const fetchCourseDetails = async (courseId: number): Promise<CourseDetails> => {
  const response = await axios.get<CourseDetails>(`${BASE_URL}/details/${courseId}`);
  return response.data;
};

const trainingService = {
  getRecommendedCourses,
  getEnrolledCourses,
  enrollInCourse,
  fetchCourseDetails,
};

export default trainingService;
