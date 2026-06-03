import { createSlice } from "@reduxjs/toolkit";
import { HamburgerMenuState } from "./HamburgerMenuState.types";
import { push } from "../router/router-slice";
import { pushSameViewAction } from "../../actions";

export const INITIAL_STATE = {
  isOpen: false,
};

const hamburgerMenuSlice = createSlice({
  name: "HamburgerMenu",
  initialState: INITIAL_STATE as HamburgerMenuState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(push, (state) => {
      state.isOpen = false;
    });

    builder.addCase(pushSameViewAction, (state) => {
      state.isOpen = false;
    });
  },
});

export const { open, close } = hamburgerMenuSlice.actions;

export default hamburgerMenuSlice;
