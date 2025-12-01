import { createSlice } from "@reduxjs/toolkit";
import type { Module } from "../../../types";

type ModulesState = {
    modules: Module[];
};

const initialState: ModulesState = {
    modules: [],
};

const modulesSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        deleteModule: (state, { payload: moduleId }: { payload: string }) => {
            state.modules = state.modules.filter((m) => m._id !== moduleId);
        },
        updateModule: (state, { payload: module }: { payload: Module }) => {
            state.modules = state.modules.map((m) => (m._id === module._id ? module : m));
        },
        setModules: (state, { payload: modules }: { payload: Module[] }) => {
            state.modules = modules;
        },
        editModule: (state, { payload: moduleId }: { payload: string }) => {
            state.modules = state.modules.map((m) => (m._id === moduleId ? { ...m, editing: true } as Module : m));
        },
    },
});

export const { deleteModule, updateModule, editModule, setModules } = modulesSlice.actions;
export default modulesSlice.reducer;
