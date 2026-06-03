import { createSlice } from "@reduxjs/toolkit";
import { FootballPlayerFixtureContext, FootballPlayerFixtureContexts } from "./FootballPlayerFixtureContext.types";

import { fetchCatalogueSuccessAction } from "../../../actions/catalogue";
import mixinDeep from "../../mixin";

export default createSlice({
  name: "FootballPlayerFixtureContext",
  initialState: {} as FootballPlayerFixtureContexts,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCatalogueSuccessAction, (state, action) => {
      const updates = action.payload.data.FootballPlayerFixtureContext || [];
      updates.forEach((update) => {
        const { urn } = update;

        if (!state[urn]) {
          state[urn] = {} as FootballPlayerFixtureContext;
        }
        const sanitizedUpdate = Object.fromEntries(
          Object.entries(update).filter((value) => value[1] !== null && value[1] !== undefined),
        );

        mixinDeep(state[urn], {
          ...sanitizedUpdate,
        });
      });
    });
  },
});
