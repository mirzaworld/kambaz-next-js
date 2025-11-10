"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";

export default function TodoForm (
    { todo, setTodo, addTodo, updateTodo }
) {
    const { todo: currentTodo } = useSelector(
        (state: RootState) => state.todosReducer
    );
    const dispatch = useDispatch();

    return (
        <ListGroupItem>
            <Button
                onClick = {() => dispatch(addTodo(currentTodo))}
                id = "wd-add-todo-click" variant = "success">
                Add
            </Button>
            <Button
                onClick = {() => dispatch(updateTodo(currentTodo))}
                id = "wd-update-todo-click" variant = "warning">
                Update
            </Button>
            <FormControl
                defaultValue = {currentTodo.title}
                onChange = {(e) =>
                    dispatch(
                        setTodo({
                            ...currentTodo,
                            title: e.target.value,
                        })
                    )
                }
            />
        </ListGroupItem>
    );
}

