"use client"

import HelloRedux from "./helloRedux";
import CounterRedux from "./counterRedux";
import AddRedux from "./addRedux";
import TodoList from "./todos/todoList";

export default function ReduxExamples() {
    return (
        <div>
            <h2> Redux Examples </h2>
            < HelloRedux />
            < CounterRedux />
            < AddRedux />
            < TodoList />
        </div>
    );
}