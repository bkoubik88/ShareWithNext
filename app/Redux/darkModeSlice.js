"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: "",
};

export const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    updateDarkMode: (state, action) => {
      //@ts-ignore
      state.darkMode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
