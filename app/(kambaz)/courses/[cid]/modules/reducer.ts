import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../database";
import { v4 as uuidv4 } from "uuid";
import type { Module } from "../../../types";

type ModulesState = {
    modules: Module[];
};

const initialState: ModulesState = {
    modules: (modules as Module[]) || [],
};

const modulesSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        addModule: (state, { payload }: { payload: Partial<Module> & { name: string; course: string } }) => {
            const newModule: Module = {
                _id: uuidv4(),
                lessons: [],
                name: payload.name,
                course: payload.course,
            } as Module;
            state.modules = [...state.modules, newModule];
        },
        deleteModule: (state, { payload: moduleId }: { payload: string }) => {
            state.modules = state.modules.filter((m) => m._id !== moduleId);
        },
        updateModule: (state, { payload: module }: { payload: Module }) => {
            state.modules = state.modules.map((m) => (m._id === module._id ? module : m));
        },
        editModule: (state, { payload: moduleId }: { payload: string }) => {
            state.modules = state.modules.map((m) => (m._id === moduleId ? { ...m, editing: true } as Module : m));
        },
    },
});

export const { addModule, deleteModule, updateModule, editModule } = modulesSlice.actions;
export default modulesSlice.reducer;
