import { createSlice } from "@reduxjs/toolkit";
import type { Assignment } from "../../../types";
const initialState = { assignments: [] as Assignment[] };
const assignmentsSlice = createSlice( {
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: ( state, { payload } ) => {
      state.assignments = payload || [];
    },
    addAssignment: ( state, { payload }: { payload: Assignment } ) => {
      state.assignments = [ ...state.assignments, payload ];
    },
    deleteAssignment: ( state, { payload: assignmentId }: { payload: string } ) => {
      state.assignments = ( state.assignments as Assignment[] ).filter( ( a ) => a._id !== assignmentId );
    },
    updateAssignment: ( state, { payload: assignment }: { payload: Assignment } ) => {
      state.assignments = ( state.assignments as Assignment[] ).map( ( a ) => a._id === assignment._id ? assignment : a );
    }
  }
} );
export const { setAssignments, addAssignment, deleteAssignment, updateAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
