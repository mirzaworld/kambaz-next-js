import axios from "axios";
const axiosWithCredentials = axios.create( { withCredentials: true } );
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const COURSES_API = `${ HTTP_SERVER }/api/courses`;
export const USERS_API = `${ HTTP_SERVER }/api/users`;
export const fetchAllCourses = async () => {
  const { data } = await axios.get( COURSES_API );
  return data;
};
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get( `${ USERS_API }/current/courses` );
  return data;
};
export const createCourse = async ( course: any ) => {
  const { data } = await axiosWithCredentials.post( COURSES_API, course );
  return data;
};
export const updateCourse = async ( courseId: string, course: any ) => {
  const { data } = await axios.put( `${ COURSES_API }/${ courseId }`, course );
  return data;
};
export const deleteCourse = async ( courseId: string ) => {
  const { data } = await axios.delete( `${ COURSES_API }/${ courseId }` );
  return data;
};
export const enrollIntoCourse = async ( userId: string, courseId: string ) => {
  const response = await axiosWithCredentials.post( `${ USERS_API }/${ userId }/courses/${ courseId }` );
  return response.data;
};
export const unenrollFromCourse = async ( userId: string, courseId: string ) => {
  const response = await axiosWithCredentials.delete( `${ USERS_API }/${ userId }/courses/${ courseId }` );
  return response.data;
};
export const findUsersForCourse = async ( courseId: string ) => {
  const response = await axios.get( `${ COURSES_API }/${ courseId }/users` );
  return response.data;
};
export default { fetchAllCourses, findMyCourses, createCourse, updateCourse, deleteCourse, enrollIntoCourse, unenrollFromCourse, findUsersForCourse };
