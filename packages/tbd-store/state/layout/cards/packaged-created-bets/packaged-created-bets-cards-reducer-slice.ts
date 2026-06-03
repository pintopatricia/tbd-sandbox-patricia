import { createSlice } from "@reduxjs/toolkit";
import { deleteLayoutAction, fetchCatalogueSuccessAction } from "../../../../actions/catalogue";
import { PackagedCreatedBetsCard } from "../Card.types";

type Slice = { [urn: string]: PackagedCreatedBetsCard };

export default createSlice({
  name: "PackagedCreatedBetsCard",
  initialState: {} as Slice,
  reducers: {},
  extraReducers(builder) {
    // New data arrived from a catalogue request
    builder.addCase(fetchCatalogueSuccessAction, (state, action) => {
      const cards = action.payload.data.PackagedCreatedBetsCard || [];
      const forceRefreshComponent = action.payload.forceRefreshComponent;

      cards.forEach((card) => {
        // Some cards do not have an urn
        if (!("urn" in card)) {
          return;
        }

        const { urn } = card;

        if (!state[urn] || forceRefreshComponent) {
          state[urn] = card;
        } else {
          state[urn].hasNextPage = card.hasNextPage;
          state[urn].endCursor = card.endCursor;
          state[urn].items.push(...card.items);
        }
      });
    });

    builder.addCase(deleteLayoutAction, () => ({}));
  },
});
