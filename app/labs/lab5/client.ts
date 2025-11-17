import axios from "axios";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const fetchWelcomeMessage = async () => {
  const response = await axios.get( `${ HTTP_SERVER }/lab5/welcome` );
  return response.data;
};

const ASSIGNMENT_API = `${HTTP_SERVER}/lab5/assignment`;
export const fetchAssignment = async () => {
  const response = await axios.get(`${ASSIGNMENT_API}`);
  return response.data;
};
export const updateTitle = async (title: string) => {
  const response = await axios.get(`${ASSIGNMENT_API}/title/${title}`);
  return response.data;
};

export const fetchTodos = async () => {
  const response = await axios.get( `${ HTTP_SERVER }/lab5/todos` );
  return response.data;
};

export const createNewTodo = async () => {
  const response = await axios.get( `${ HTTP_SERVER }/lab5/todos/create` );
  return response.data;
};

export const postNewTodo = async ( todo: any ) => {
  const response = await axios.post( `${ HTTP_SERVER }/lab5/todos`, todo );
  return response.data;
};

export const removeTodo = async ( todo: any ) => {
  const response = await axios.get( `${ HTTP_SERVER }/lab5/todos/${ todo.id }/delete` );
  return response.data;
};

export const deleteTodo = async ( todo: any ) => {
  const response = await axios.delete( `${ HTTP_SERVER }/lab5/todos/${ todo.id }` );
  return response.data;
};

export const updateTodo = async ( todo: any ) => {
  const response = await axios.put( `${ HTTP_SERVER }/lab5/todos/${ todo.id }`, todo );
  return response.data;
};
