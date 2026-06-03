import { createSlice } from "@reduxjs/toolkit";
import { PredictsState } from "./PredictsState.types";
import { UI__CLOSE_PREDICTS, UI__OPEN_PREDICTS } from "../../actions/predicts";

export const INITIAL_STATE: PredictsState = {
  isOpen: false,
};

const predictsSlice = createSlice({
  name: "Predicts",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UI__OPEN_PREDICTS, (state) => {
        state.isOpen = true;
      })
      .addCase(UI__CLOSE_PREDICTS, (state) => {
        state.isOpen = false;
      });
  },
});

export default predictsSlice;
