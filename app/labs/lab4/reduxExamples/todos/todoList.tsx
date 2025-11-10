"use client";

import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import TodoForm from "./todoForm";
import TodoItem from "./todoItem";

export default function TodoList () {

    const [todos, setTodos] = useState([
        { id: "1", title: "Learn React" },
        { id: "2", title: "Learn Node"  },
    ]);
    
    const [todo, setTodo] = useState({ id: "-1", title: "Learn Mongo" });

    const addTodo = (todo: any) => {
        const newTodos = [
            ...todos,
            {
                ...todo,
                id: new Date().getTime().toString(),
            },
        ];
        setTodos(newTodos);
        setTodo({ id: "-1", title: "" });
    };

    const deleteTodo = (id: string) => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
    };

    const updateTodo = (todo: any) => {
        const newTodos = todos.map((item) =>
            (item.id === todo.id ? todo : item)
        );
        setTodos(newTodos);
        setTodo({ id: "-1", title: "" });
    };

    return (
        <div id = "wd-todo-list-redux" >
            <h2> Todo List </h2>
            <ListGroup>
                <TodoForm
                    todo = {todo}
                    setTodo = {setTodo}
                    addTodo = {addTodo}
                    updateTodo = {updateTodo}
                />
                {todos.map((todo) => (
                    <TodoItem
                        key = {todo.id}
                        todo = {todo}
                        deleteTodo = {deleteTodo}
                        setTodo = {setTodo}
                    />
                ))}
            </ListGroup>
            <hr />
        </div>
    );
}
