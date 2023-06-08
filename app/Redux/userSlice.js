"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nextUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.nextUser = action.payload;
    },
    like: (state, action) => {
      if (!state.nextUser?.bookmarks?.includes(action.payload)) {
        state.nextUser?.bookmarks?.push(action.payload);
      } else {
        state.nextUser?.bookmarks?.splice(
          state.nextUser?.bookmarks?.findIndex(
            (productId) => productId === action.payload
          ),
          1
        );
      }
    },
    login: (state, action) => {
      state.nextUser = action.payload;
    },
    logout: (state) => {
      state.nextUser = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, login, logout, like } = userSlice.actions;

export default userSlice.reducer;
