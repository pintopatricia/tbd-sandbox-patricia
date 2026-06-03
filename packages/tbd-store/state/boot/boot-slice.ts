import { createSlice } from "@reduxjs/toolkit";
import { BootState } from "./BootState.types";
import {
  type FetchAppContextSuccessAction,
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
} from "../../actions/app-context";

const INITIAL_STATE: BootState = {
  allowLoadFromStorage: true,
  canUsePhoenixExchange: false,
  devTools: false,
};

const bootSlice = createSlice({
  name: "Boot",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING, (state) => {
      state.failed = "blocked";
    });

    builder.addCase(NETWORK__FETCH_APP_CONTEXT_FAILURE, (state) => {
      state.failed = "failed";
    });

    builder.addCase(NETWORK__FETCH_APP_CONTEXT_SUCCESS, (state, action: FetchAppContextSuccessAction) => {
      state.failed = undefined;
      state.canUsePhoenixExchange = action.payload.initialState.boot?.canUsePhoenixExchange ?? false;
    });
  },
});

export default bootSlice.reducer;
