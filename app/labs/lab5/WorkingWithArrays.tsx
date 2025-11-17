"use client";
import React, { useState } from "react";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithArrays() {
  const API = `${ HTTP_SERVER }/lab5/todos`;
  const [ todo, setTodo ] = useState( { id: "1", title: "Task 1", description: "Task 1 description", completed: false } );
  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={ API }>Get Todos</a>
      <hr />
      <h4>Retrieving an Item from an Array by ID</h4>
      <input id="wd-todo-id" defaultValue={ todo.id } className="w-25" onChange={ ( e ) => setTodo( { ...todo, id: e.target.value } ) } />
      <a id="wd-retrieve-todo-by-id" className="btn btn-primary ms-2" href={`${ API }/${ todo.id }`}>Get Todo by ID</a>
      <hr />
      <h4>Filtering Array Items</h4>
      <a id="wd-retrieve-completed-todos" className="btn btn-primary" href={`${ API }?completed=true`}>Get Completed Todos</a>
      <hr />
      <h4>Creating new Items in an Array</h4>
      <a id="wd-create-todo" className="btn btn-primary" href={`${ API }/create`}>Create Todo</a>
      <hr />
      <h4>Removing from an Array</h4>
      <input defaultValue={ todo.id } className="w-25" onChange={ ( e ) => setTodo( { ...todo, id: e.target.value } ) } />
      <a id="wd-remove-todo" className="btn btn-danger ms-2" href={`${ API }/${ todo.id }/delete`}>Remove Todo with ID = { todo.id }</a>
      <hr />
      <h4>Updating an Item in an Array</h4>
      <input defaultValue={ todo.id } className="w-25" onChange={ ( e ) => setTodo( { ...todo, id: e.target.value } ) } />
      <input defaultValue={ todo.title } className="w-50 ms-2" onChange={ ( e ) => setTodo( { ...todo, title: e.target.value } ) } />
      <a id="wd-update-todo" className="btn btn-primary ms-2" href={`${ API }/${ todo.id }/title/${ todo.title }`}>Update Todo</a>
      <hr />
      <h4>Updating Description and Completed</h4>
      <input id="wd-update-description-id" defaultValue={ todo.id } className="w-25" onChange={ ( e ) => setTodo( { ...todo, id: e.target.value } ) } />
      <input id="wd-update-description" defaultValue={ todo.description } className="w-50 ms-2" onChange={ ( e ) => setTodo( { ...todo, description: e.target.value } ) } />
      <a id="wd-update-todo-description" className="btn btn-primary ms-2" href={`${ API }/${ todo.id }/description/${ todo.description }`}>Describe Todo ID = { todo.id }</a>
      <hr />
      <h4>Updating Completed Property</h4>
      <input id="wd-update-completed-id" defaultValue={ todo.id } className="w-25" onChange={ ( e ) => setTodo( { ...todo, id: e.target.value } ) } />
      <input id="wd-update-completed" type="checkbox" checked={ !!todo.completed } onChange={ ( e ) => setTodo( { ...todo, completed: e.target.checked } ) } />
      <a id="wd-update-todo-completed" className="btn btn-primary ms-2" href={`${ API }/${ todo.id }/completed/${ todo.completed }`}>Complete Todo ID = { todo.id }</a>
      <hr />
    </div>
  );
}
