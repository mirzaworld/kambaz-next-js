import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../database";
import { v4 as uuidv4 } from "uuid";
import type { Enrollment } from "../types";

const initialState = {
  enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollUser: (state, { payload }) => {
      const newEnrollment: Enrollment = {
        _id: uuidv4(),
        user: payload.user,
        course: payload.course,
      };
      state.enrollments = [...state.enrollments, newEnrollment];
    },
    unenrollUser: (state, { payload: enrollmentId }: { payload: string }) => {
      state.enrollments = (state.enrollments as Enrollment[]).filter((e) => e._id !== enrollmentId);
    },
  },
});

export const { enrollUser, unenrollUser } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
