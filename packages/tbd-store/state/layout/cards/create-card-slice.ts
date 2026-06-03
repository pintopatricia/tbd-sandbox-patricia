import { Draft, createSlice } from "@reduxjs/toolkit";
import { BasicCard } from "./Card.types";
import { deleteLayoutAction, fetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { NormalizersResult } from "../../../services/catalogue/normalizer/normalizer-engine";
import mixinDeep from "../../mixin";

export default function createSliceFactory<T extends BasicCard>(typename: keyof NormalizersResult) {
  type Slice = { [urn: string]: T };

  return createSlice({
    name: typename,
    initialState: {} as Slice,
    reducers: {},
    extraReducers(builder) {
      // New data arrived from a catalogue request
      builder.addCase(fetchCatalogueSuccessAction, (state, action) => {
        const cards = action.payload.data[typename] || [];

        cards.forEach((card) => {
          // Some cards do not have an urn
          if (!(card && "urn" in card)) {
            return;
          }

          const { urn } = card;

          if (!state[urn]) {
            state[urn] = card as unknown as Draft<T>;
          } else {
            mixinDeep(state[urn], card);
          }
        });
      });

      // Delete layout action
      builder.addCase(deleteLayoutAction, (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        state = {} as Draft<Slice>;
      });
    },
  });
}
