"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: [],
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { updateFilter } = filterSlice.actions;

export default filterSlice.reducer;
