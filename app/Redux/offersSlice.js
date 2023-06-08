"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offers: [],
};

export const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    clear: (state) => {
      state.offers = [];
    },
    updateOffer: (state, action) => {
      //@ts-ignore
      if (!state.offers.includes(action.payload)) {
        //@ts-ignore
        state.offers.push(action.payload);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateOffer, clear } = offerSlice.actions;

export default offerSlice.reducer;
