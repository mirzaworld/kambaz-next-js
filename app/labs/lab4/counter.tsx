import { useState } from "react";

export default function Counter() {
    //let count = 7;
    const [count, setCount] = useState(7);
    console.log(count);
    return (
        <div id = "wd-counter-use-state">
            <h2> Counter: {count} </h2>
            <button onClick = {() => setCount(count + 1)}
                id = "wd-counter-up green" className = "btn text-white btn-success"> Up </button> &nbsp;&nbsp;
                <button onClick = {() => setCount(count - 1)}
                id = "wd-counter-down-click" className = "btn text-white bg-danger" > Down </button>
            <hr />
        </div>
    );
}