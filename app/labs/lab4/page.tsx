"use client";
import store from "./store";
import { Provider } from "react-redux";
import ClickEvent from "./clickEvent";
import Counter from "./counter";
import EventObject from "./eventObject";
import PassingDataOnEvent from "./passingDataOnEvent";
import PassingFunctions from "./passingFunctions";
import BooleanStateVariables from "./booleanStateVariables";
import StringStateVariables from "./stringStateVariables";
import DateStateVariable from "./dateStateVariables";
import ObjectStateVariable from "./objectStateVariable";
import ArrayStateVariable from "./arrayStateVariable";
import ParentStateComponent from "./parentStateComponent";
import ReduxExamples from "./reduxExamples";


export default function lab4 () {
    function sayHello() {
        alert("Hello");
    }
    return (
        <Provider store = {store}>
            <div id = "wd-lab4 wd-passing-functions" >
                <h1> Lab 4 </h1> 
                <h2> Maintaining State in React Applications </h2>
                <br />
                <ClickEvent />
                <PassingDataOnEvent />
                <PassingFunctions theFunction = {sayHello} />
                <EventObject />
                <Counter />
                <BooleanStateVariables />
                <StringStateVariables />
                <DateStateVariable />
                <ObjectStateVariable />
                <ArrayStateVariable />
                <ParentStateComponent />
                <ReduxExamples />
            </div>
        </Provider>
    );
}