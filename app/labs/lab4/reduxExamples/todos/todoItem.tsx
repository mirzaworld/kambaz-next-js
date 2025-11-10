"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { ListGroupItem, Button } from "react-bootstrap";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem (
    { todo, deleteTodo, setTodo }
) {
    const dispatch = useDispatch();

    return (
        <ListGroupItem key = {todo.id} >
            <Button
                onClick = {() => dispatch(deleteTodo(todo.id))}
                id = "wd-delete-todo-click" variant = "danger">
                Delete
            </Button>
            <Button
                onClick = {() => dispatch(setTodo(todo))}
                id = "wd-set-todo-click" variant = "primary">
                Edit
            </Button>
            {todo.title}
        </ListGroupItem>
    );
}
