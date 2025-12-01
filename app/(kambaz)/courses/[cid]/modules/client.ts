import axios from "axios";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${ HTTP_SERVER }/api/courses`;
export const findModulesForCourse = async ( courseId: string ) => {
  const { data } = await axios.get( `${ COURSES_API }/${ courseId }/modules` );
  return data;
};
export const createModuleForCourse = async ( courseId: string, module: any ) => {
  const { data } = await axios.post( `${ COURSES_API }/${ courseId }/modules`, module );
  return data;
};
export const updateModule = async ( courseId: string, module: any ) => {
  const { data } = await axios.put(
    `${ COURSES_API }/${ courseId }/modules/${ module._id }`,
    module
  );
  return data;
};
export const deleteModule = async ( courseId: string, moduleId: string ) => {
  const { data } = await axios.delete(
    `${ COURSES_API }/${ courseId }/modules/${ moduleId }`
  );
  return data;
};
export default { findModulesForCourse, createModuleForCourse, updateModule, deleteModule };
