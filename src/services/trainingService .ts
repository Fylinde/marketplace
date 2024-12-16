import axios from 'axios';

const BASE_URL = '/api/training'; // Replace with your backend API endpoint

const trainingService = {
  async getRecommendedCourses() {
    const response = await axios.get(`${BASE_URL}/recommended`);
    return response.data; // Expected: [{ id: 1, title: "Course A", progress: 50, category: "Sales" }, ...]
  },

  async getEnrolledCourses() {
    const response = await axios.get(`${BASE_URL}/enrolled`);
    return response.data; // Expected: [{ id: 2, title: "Course B", progress: 80 }, ...]
  },

  async enrollInCourse(courseId: number) {
    const response = await axios.post(`${BASE_URL}/enroll`, { courseId });
    return response.data; // Response may include updated enrolled courses or status
  },

  async fetchCourseDetails(courseId: number) {
    const response = await axios.get(`${BASE_URL}/course/${courseId}`);
    return response.data; // Expected: { id: 1, title: "Course A", content: [...], quizzes: [...] }
  },
};

export default trainingService;
