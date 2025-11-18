import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../../database";
import type { Assignment } from "../../../types";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: assignments,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload }) => {
      const newAssignment = payload._id
        ? payload
        : {
            _id: uuidv4(),
            title: payload.title,
            course: payload.course,
          };
      state.assignments = [...state.assignments, newAssignment];
    },
    // Replace assignments array (used when loading from server)
    setAssignments: (state, { payload }) => {
      state.assignments = payload || [];
    },
    deleteAssignment: (state, { payload: assignmentId }: { payload: string }) => {
      state.assignments = (state.assignments as Assignment[]).filter((a) => a._id !== assignmentId);
    },
    updateAssignment: (state, { payload: assignment }: { payload: Assignment }) => {
      state.assignments = (state.assignments as Assignment[]).map((a) => (a._id === assignment._id ? assignment : a));
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment, setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
