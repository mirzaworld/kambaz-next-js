
import { Button } from "react-bootstrap";
import VariablesAndConstants from "./variablesandconstants";
import VariableTypes from "./variableTypes";
import BooleanVariables from "./booleanVariables";
import IfElse from "./ifElse";
import TernaryOperator from "./ternaryOperator";
import ConditionalOutputIfElse from "./conditionalOutputIfElse";
import ConditionalOutputInline from "./conditionalOutputInline";
import LegacyFunctions from "./legacyFunctions";
import ArrowFunctions from "./arrowFunctions";
import ImpliedReturn from "./impliedReturn";
import TemplateLiterals from "./templateLiterals";
import SimpleArrays from "./simpleArrays";
import ArrayIndexAndLength from "./arrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./addingAndRemovingToFromArrays";
import ForLoops from "./forLoops";
import MapFunction from "./mapFunction";
import FindFunction from "./findFunction";
import FindIndex from "./findIndex";
import FilterFunction from "./filterFunction";
import JsonStringify from "./jsonStringify";
import House from "./house";
import Spreading from "./spreader";
import Destructing from "./destructing";
import FunctionDestructing from "./functionDestructing";
import DestructingImports from "./destructingImports";
import Classes from "./classes";
import Styles from "./styles";
import Add from "./add";
import Square from "./square";
import Highlight from "./highlight";
import PathParameters from "./pathParameters";
import TodoItem from "./todos/todoItem";
import TodoList from "./todos/todoList";

export default function lab3 () {
    console.log("Hello World");
    return (
        <div>
            <h2> Lab 3 </h2>
            <h2> Intro to TypeScript </h2>
            <br />
            <VariablesAndConstants />
            <br />
            <VariableTypes />
            <br />
            <BooleanVariables />
            <br />
            <IfElse />
            <br />
            <TernaryOperator />
            <br />
            <ConditionalOutputIfElse />
            <br />
            <ConditionalOutputInline />
            <br />
            <LegacyFunctions />
            <br />
            <ArrowFunctions />
            <br />
            <ImpliedReturn />
            <br />
            <TemplateLiterals />
            <br />
            <SimpleArrays />
            <br />
            <ArrayIndexAndLength />
            <br />
            <AddingAndRemovingToFromArrays />
            <br />
            <ForLoops />
            <br />
            <MapFunction />
            <br />
            <FindFunction />
            <br />
            <FindIndex />
            <br />
            <FilterFunction />
            <br />
            <JsonStringify />
            <br />
            <House />
            <br />
            <Spreading />
            <br />
            <Destructing />
            <br />
            <FunctionDestructing />
            <br />
            <DestructingImports />
            <br />
            <Classes />
            <br />
            <Styles />
            <br />
            <Add a={3} b = {4} />
            <br />
            <h4> Square of 4 </h4>
            <Square>4</Square>
            <hr />
            <Highlight> 
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipitratione eaque illo minus cum, saepe totam
                vel nihil repellat nemo explicabo excepturi consectetur. Modi omnis minus sequi maiores, provident voluptates.
            </Highlight>
            <hr />
            <PathParameters />
            <br />
            <TodoItem />
            <br />
            <TodoList />
            <br />
            <Button href = "/labs"> Back </Button>
        </div>
    );
}