"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default function ArrayStateVariable() {

    const [array, setArray] = useState([1, 2, 3, 4, 5]);
    
    const { todos } = useSelector((state: RootState) => state.todosReducer);

    const addElement = () => {
        setArray([...array, Math.floor(Math.random() * 100)]);
    };
    
    const deleteElement = (index: number) => {
        setArray(array.filter((item, i) => i !== index));
    };
    
    return (
        <div id="wd-array-state-variables">
        <h2>Array State Variable</h2>
        <button onClick={addElement} className = "btn btn-success" >Add Element</button> <hr />
        <ul>  
            {array.map((item, index) => (
                <li key={index}> {item}
                    <button onClick={() => deleteElement(index)} className = "btn text-white bg-danger fs-6 mx-5" >
                        Delete
                    </button>
                    <hr />
                </li>
                
            ))}
        </ul>
        <hr/>
        <h3>Todos from Redux</h3>
        <ListGroup>
            {todos.map((todo: any) => (
        <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
        </ListGroup>
        <hr />
        </div>
    );
}