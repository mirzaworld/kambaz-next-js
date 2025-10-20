export default function SimpleArrays() {
    var functionScoped = 2; let blockScoped = 5;
    const constant1 = functionScoped - blockScoped;
    let numberArray1 = [1, 2, 3, 4, 5];
    let stringArray1 = ["string1", "string2"];
    let htmlArray1 = [<li key = {1}> Buy Milk</li>, <li key = {2}> Feed the Pets</li>];
    let variableArray1 = [functionScoped, blockScoped, constant1, numberArray1, stringArray1 ];

    return (
        <div id = "wd-simple-arrays">
            <h4> Simple Arrays </h4>
            numberArray1 = {numberArray1} <br />
            stringArray1 = {stringArray1} <br />
            variableArray1 = {variableArray1} <br />
            <h5>Todo List: </h5>
            <ol> {htmlArray1}</ol>
            <hr />
        </div>
    );
}