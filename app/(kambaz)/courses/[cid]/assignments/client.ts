import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export const fetchAssignmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/courses/${courseId}/assignments`);
  return response.data;
};

export const fetchAssignmentById = async (assignmentId: string) => {
  const response = await axiosWithCredentials.get(`${HTTP_SERVER}/api/assignments/${assignmentId}`);
  return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  const response = await axiosWithCredentials.post(`${HTTP_SERVER}/api/courses/${courseId}/assignments`, assignment);
  return response.data;
};

export const updateAssignment = async (assignmentId: string, assignment: any) => {
  const response = await axiosWithCredentials.put(`${HTTP_SERVER}/api/assignments/${assignmentId}`, assignment);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosWithCredentials.delete(`${HTTP_SERVER}/api/assignments/${assignmentId}`);
  return response.data;
};

export default {
  fetchAssignmentsForCourse,
  fetchAssignmentById,
  createAssignmentForCourse,
  updateAssignment,
  deleteAssignment,
};
