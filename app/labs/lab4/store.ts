import { configureStore } from "@reduxjs/toolkit";

import helloReducer from "./reduxExamples/helloRedux/helloReducer";
import counterReducer from "./reduxExamples/counterRedux/counterReducer";
import addReducer from "./reduxExamples/addRedux/addReducer";
import  todosReducer from "./reduxExamples/todos/todosReducer";


const store = configureStore({
  reducer: {
     helloReducer, 
     counterReducer,
     addReducer,
     todosReducer,
    }
  }
);

export type RootState = ReturnType<typeof store.getState>;
export default store;