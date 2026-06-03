import { createSlice } from "@reduxjs/toolkit";
import { deleteLayoutAction, fetchCatalogueSuccessAction } from "../../../../actions/catalogue";
import { PriceBoostMultisListCard } from "../Card.types";

type Slice = { [urn: string]: PriceBoostMultisListCard };

export default createSlice({
  name: "PriceBoostMultisListCard",
  initialState: {} as Slice,
  reducers: {},
  extraReducers(builder) {
    // New data arrived from a catalogue request
    builder.addCase(fetchCatalogueSuccessAction, (state, action) => {
      const cards = action.payload.data.PriceBoostMultisListCard || [];

      cards.forEach((card) => {
        // Some cards do not have an urn
        if (!("urn" in card)) {
          return;
        }

        const { urn } = card;

        if (!state[urn]) {
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
